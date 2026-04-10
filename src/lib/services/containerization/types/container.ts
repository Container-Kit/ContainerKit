import type { ContainerId, ImageReference, Port, Container } from './common';

export type ContainerSummary = Pick<Container, 'id' | 'name' | 'status' | 'image'>;

export type ContainerState = 'running' | 'stopped' | 'paused' | 'exited' | 'dead';

export type ContainerInspection = Container & {
    readonly pidNumber: number;
    readonly exitCode: number;
    readonly workingDir: string;
    readonly environment: Record<string, string>;
    readonly labels: Record<string, string>;
};

export type CreateContainerOptions = {
    readonly name?: string;
    readonly image: ImageReference;
    readonly command?: readonly string[];
    readonly environment?: Record<string, string>;
    readonly ports?: readonly Port[];
    readonly labels?: Record<string, string>;
};
