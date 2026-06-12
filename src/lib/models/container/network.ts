import { z } from 'zod';

/**
 * Shape of one entry from `container network list --format json` (CLI 1.0.0).
 * Loose object: only fields the app reads are validated.
 */
export const ContainerNetworkSchema = z.looseObject({
    id: z.string(),
    configuration: z.looseObject({
        name: z.string(),
        mode: z.string().optional(),
        creationDate: z.string().optional(),
        labels: z.record(z.string(), z.unknown()).optional()
    }),
    // present while the network is up
    status: z
        .looseObject({
            ipv4Subnet: z.string().optional(),
            ipv4Gateway: z.string().optional(),
            ipv6Subnet: z.string().optional()
        })
        .optional()
});

export type ContainerNetwork = z.infer<typeof ContainerNetworkSchema>;

/** Built-in networks (like `default`) can't be deleted. */
export const isBuiltinNetwork = (network: ContainerNetwork): boolean =>
    network.configuration.labels?.['com.apple.container.resource.role'] === 'builtin';
