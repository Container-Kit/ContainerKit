import { z } from 'zod';

/**
 * Shape of one entry from `container image list --format json` (CLI 1.0.0).
 * Loose object: only fields the app reads are validated, anything
 * else the CLI emits passes through untouched.
 */
export const ContainerImageSchema = z.looseObject({
    id: z.string(),
    configuration: z.looseObject({
        // full reference, e.g. `docker.io/library/redis:latest`
        name: z.string(),
        creationDate: z.string().optional(),
        descriptor: z
            .looseObject({
                digest: z.string(),
                size: z.number(),
                mediaType: z.string()
            })
            .optional()
    }),
    // one entry per platform; `size` is the variant's total blob size in bytes
    variants: z
        .array(
            z.looseObject({
                size: z.number().optional(),
                platform: z
                    .looseObject({ architecture: z.string(), os: z.string() })
                    .optional()
            })
        )
        .default([])
});

export type ContainerImage = z.infer<typeof ContainerImageSchema>;

/** Full reference of an image, e.g. `docker.io/library/redis:latest`. */
export const imageReference = (image: ContainerImage): string => image.configuration.name;

/** Total size in bytes across all platform variants, or null if the CLI gave none. */
export function imageSizeInBytes(image: ContainerImage): number | null {
    const sizes = image.variants.map((variant) => variant.size).filter((size) => size != null);
    if (!sizes.length) return null;
    return sizes.reduce((total, size) => total + size, 0);
}
