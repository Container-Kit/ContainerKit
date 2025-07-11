export type ContainerImage = {
    descriptor: {
        digest: string;
        size: number;
        mediaType: string;
    };
    reference: string;
};