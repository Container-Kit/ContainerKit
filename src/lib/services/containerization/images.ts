import {
    createContainerCommand,
    validateCommandOutput
} from '$lib/services/containerization/utils';
import type { Output } from '$lib/services/containerization/models';

export async function getAllImages(): Promise<Output> {
    const command = createContainerCommand(['image', 'ls', '--format', 'json']);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export function createPullImageCommand(imageDetails: Array<string>) {
    return createContainerCommand(['image', 'pull', ...imageDetails]);
}

export async function pullImage(imageDetails: Array<string>): Promise<Output> {
    const command = createContainerCommand(['image', 'pull', ...imageDetails]);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export async function removeImage(imageReference: string): Promise<Output> {
    return removeMultipleImages([imageReference]);
}

export async function removeMultipleImages(imagesReference: Array<string>): Promise<Output> {
    const command = createContainerCommand(['image', 'rm', imagesReference.join(' ')]);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export async function inspectImage(imageReference: string): Promise<Output> {
    const command = createContainerCommand(['image', 'inspect', imageReference]);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export async function importImageFromTar(path: string): Promise<Output> {
    const command = createContainerCommand(['image', 'load', '-i', path]);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export async function exportImageToTar(imageReference: string, path: string, additionalOptions: string[] = []): Promise<Output> {
    // container i save --arch aarch64 --output /Users/shivammeena/Projects/ContainerKit/static/test-tar.tar redis
    const command = createContainerCommand(['image', 'save', ...additionalOptions, '-o', path, imageReference]);
    const output = await command.execute();
    return validateCommandOutput(output);
}
