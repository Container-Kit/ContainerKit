import { z } from 'zod';

/**
 * Shape of one entry from `container volume list --format json` (CLI 1.0.0).
 * Loose object: only fields the app reads are validated.
 */
export const ContainerVolumeSchema = z.looseObject({
    id: z.string(),
    configuration: z.looseObject({
        name: z.string(),
        driver: z.string().optional(),
        format: z.string().optional(),
        creationDate: z.string().optional(),
        sizeInBytes: z.number().optional(),
        source: z.string().optional()
    })
});

export type ContainerVolume = z.infer<typeof ContainerVolumeSchema>;
