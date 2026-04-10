import type { ImageReference } from './common';

export type ImageSummary = {
    readonly id: string;
    readonly reference: ImageReference;
    readonly created: Date;
    readonly size: number;
};

export type ImageInspection = ImageSummary & {
    readonly architecture: string;
    readonly os: string;
    readonly author: string;
    readonly config: {
        readonly entrypoint?: readonly string[];
        readonly cmd?: readonly string[];
        readonly workingDir: string;
        readonly environment: Record<string, string>;
        readonly exposedPorts?: Record<string, unknown>;
    };
};

export type ImagePullOptions = {
    readonly platform?: string;
    readonly quiet?: boolean;
};

export type ImagePullResponse = {
    readonly imageId: string;
    readonly imageReference: ImageReference;
    readonly digest: string;
};
