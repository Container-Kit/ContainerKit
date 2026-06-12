import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { parseJson } from './cli';
import { ContainerClientSchema } from '$lib/models/container/container';
import {
    ContainerImageSchema,
    imageReference,
    imageSizeInBytes
} from '$lib/models/container/image';

// Fixtures captured from `container` CLI 1.0.0 output (trimmed to relevant fields)
const runningContainerFixture = {
    id: 'ck-test',
    configuration: {
        id: 'ck-test',
        creationDate: '2026-06-12T06:51:06Z',
        image: {
            reference: 'docker.io/library/alpine:3.22',
            descriptor: {
                digest: 'sha256:310c62b5e7ca5b08167e4384c68db0fd2905dd9c7493756d356e893909057601',
                mediaType: 'application/vnd.oci.image.index.v1+json',
                size: 9218
            }
        },
        platform: { os: 'linux', architecture: 'arm64' },
        resources: { cpuOverhead: 1, cpus: 4, memoryInBytes: 1073741824 },
        rosetta: false,
        runtimeHandler: 'container-runtime-linux',
        labels: {},
        mounts: [],
        networks: [{ network: 'default', options: { hostname: 'ck-test', mtu: 1280 } }]
    },
    status: {
        state: 'running',
        startedDate: '2026-06-12T06:51:08Z',
        networks: [
            {
                network: 'default',
                hostname: 'ck-test',
                ipv4Address: '192.168.64.2/24',
                ipv4Gateway: '192.168.64.1',
                ipv6Address: 'fdc0:7822:14cd:573:f88f:efff:fe12:aecd/64',
                macAddress: 'fa:8f:ef:12:ae:cd',
                mtu: 1280
            }
        ]
    }
};

const stoppedContainerFixture = {
    id: 'ck-stopped',
    configuration: {
        id: 'ck-stopped',
        image: { reference: 'docker.io/library/alpine:3.22' }
    },
    // stopped containers carry no startedDate and an empty networks list
    status: { state: 'stopped', networks: [] }
};

const imageFixture = {
    id: '310c62b5e7ca5b08167e4384c68db0fd2905dd9c7493756d356e893909057601',
    configuration: {
        creationDate: '2026-04-16T23:53:00Z',
        descriptor: {
            digest: 'sha256:310c62b5e7ca5b08167e4384c68db0fd2905dd9c7493756d356e893909057601',
            mediaType: 'application/vnd.oci.image.index.v1+json',
            size: 9218
        },
        name: 'docker.io/library/alpine:3.22'
    },
    variants: [
        {
            digest: 'sha256:a46b5c913cad8b1038883ec9aff6003b4a11fdae3229a8e9e3a68f757d724cef',
            platform: { architecture: 'arm64', os: 'linux', variant: 'v8' },
            size: 4143546
        }
    ]
};

describe('parseJson', () => {
    it('parses a container list', () => {
        const result = parseJson(
            JSON.stringify([runningContainerFixture, stoppedContainerFixture]),
            z.array(ContainerClientSchema)
        );
        expect(result.ok).toBe(true);
        if (!result.ok) return;
        expect(result.data[0].configuration.id).toBe('ck-test');
        expect(result.data[0].status.state).toBe('running');
        expect(result.data[0].status.startedDate).toBe('2026-06-12T06:51:08Z');
        expect(result.data[0].status.networks[0].ipv4Address).toBe('192.168.64.2/24');
        expect(result.data[1].status.state).toBe('stopped');
        expect(result.data[1].status.startedDate).toBeUndefined();
        expect(result.data[1].status.networks).toEqual([]);
    });

    it('keeps unknown CLI fields via loose objects', () => {
        const withExtra = { ...runningContainerFixture, someNewCliField: 42 };
        const result = parseJson(JSON.stringify([withExtra]), z.array(ContainerClientSchema));
        expect(result.ok).toBe(true);
        if (!result.ok) return;
        expect(result.data[0]).toMatchObject({ someNewCliField: 42 });
    });

    it('parses an image list', () => {
        const result = parseJson(JSON.stringify([imageFixture]), z.array(ContainerImageSchema));
        expect(result.ok).toBe(true);
        if (!result.ok) return;
        expect(imageReference(result.data[0])).toBe('docker.io/library/alpine:3.22');
        expect(imageSizeInBytes(result.data[0])).toBe(4143546);
    });

    it('returns null size for an image without variant sizes', () => {
        const noVariants = { ...imageFixture, variants: [] };
        const result = parseJson(JSON.stringify([noVariants]), z.array(ContainerImageSchema));
        expect(result.ok).toBe(true);
        if (!result.ok) return;
        expect(imageSizeInBytes(result.data[0])).toBeNull();
    });

    it('rejects malformed JSON', () => {
        const result = parseJson('not json', z.array(ContainerImageSchema));
        expect(result).toEqual({ ok: false, error: 'Command did not return valid JSON' });
    });

    it('reports the path of a missing load-bearing field', () => {
        const broken = { ...runningContainerFixture, configuration: { image: { reference: 'x' } } };
        const result = parseJson(JSON.stringify([broken]), z.array(ContainerClientSchema));
        expect(result.ok).toBe(false);
        if (result.ok) return;
        expect(result.error).toContain('configuration.id');
    });
});
