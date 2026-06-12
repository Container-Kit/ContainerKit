import { z } from 'zod';

/**
 * Shapes for `container list --format json` output (CLI 1.0.0).
 * Loose objects: only the fields the app reads are validated, anything
 * else the CLI emits passes through untouched. Apple's container CLI is
 * still unstable, so we keep validation to the load-bearing fields.
 */
export const NetworkAttachmentSchema = z.looseObject({
    network: z.string().optional(),
    hostname: z.string(),
    ipv4Address: z.string(),
    ipv4Gateway: z.string().optional(),
    ipv6Address: z.string().optional(),
    macAddress: z.string().optional()
});

export const ContainerConfigurationSchema = z.looseObject({
    id: z.string(),
    // narrower than the standalone image schema: `container list` only
    // guarantees a reference here
    image: z.looseObject({ reference: z.string() }),
    hostname: z.string().optional(),
    platform: z.looseObject({ os: z.string(), architecture: z.string() }).optional(),
    resources: z.looseObject({ cpus: z.number(), memoryInBytes: z.number() }).optional(),
    rosetta: z.boolean().optional(),
    runtimeHandler: z.string().optional(),
    labels: z.record(z.string(), z.unknown()).optional(),
    mounts: z.array(z.unknown()).optional()
});

// `startedDate` (ISO string) and populated `networks` only exist while running
export const ContainerStatusSchema = z.looseObject({
    state: z.enum(['running', 'stopped']),
    startedDate: z.string().optional(),
    networks: z.array(NetworkAttachmentSchema).default([])
});

export const ContainerClientSchema = z.looseObject({
    id: z.string(),
    configuration: ContainerConfigurationSchema,
    status: ContainerStatusSchema
});

export type NetworkAttachment = z.infer<typeof NetworkAttachmentSchema>;
export type ContainerConfiguration = z.infer<typeof ContainerConfigurationSchema>;
export type ContainerStatus = z.infer<typeof ContainerStatusSchema>;
export type ContainerState = ContainerStatus['state'];
export type ContainerClient = z.infer<typeof ContainerClientSchema>;
