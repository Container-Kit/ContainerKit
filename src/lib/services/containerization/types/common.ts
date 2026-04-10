// Brand types for compile-time safety
export type ContainerId = string & { readonly __brand: 'ContainerId' };
export type ImageReference = string & { readonly __brand: 'ImageReference' };
export type DomainName = string & { readonly __brand: 'DomainName' };

import type { Result } from './result';

export const createContainerId = (id: string): Result<ContainerId> =>
    id.length > 0 && /^[a-zA-Z0-9_.-]+$/.test(id)
        ? { tag: 'success', value: id as ContainerId }
        : { tag: 'failure', error: `Invalid container ID: ${id}`, stderr: '' };

export const createImageReference = (ref: string): Result<ImageReference> =>
    ref.length > 0
        ? { tag: 'success', value: ref as ImageReference }
        : { tag: 'failure', error: `Invalid image reference: ${ref}`, stderr: '' };

export const createDomainName = (name: string): Result<DomainName> =>
    /^[a-z0-9.-]+$/i.test(name)
        ? { tag: 'success', value: name as DomainName }
        : { tag: 'failure', error: `Invalid domain name: ${name}`, stderr: '' };

// Immutable data types
export type Container = {
    readonly id: ContainerId;
    readonly name: string;
    readonly status: 'running' | 'stopped' | 'paused' | 'exited';
    readonly image: ImageReference;
    readonly created: Date;
    readonly ports: readonly Port[];
};

export type Port = {
    readonly internal: number;
    readonly external?: number;
    readonly protocol: 'tcp' | 'udp';
};

export type Image = {
    readonly id: string;
    readonly reference: ImageReference;
    readonly created: Date;
    readonly size: number;
};
