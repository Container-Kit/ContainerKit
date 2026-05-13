import {
    createContainerCommand,
    validateCommandOutput
} from '$lib/services/containerization/utils';
import type { Output } from '$lib/services/containerization/models';
import { CONTAINER_SUBCOMMANDS } from '$lib/helpers/containerization/commands/container';
import {
    CONTAINER_IMAGE_SUBCOMMANDS,
    CONTAINER_IMAGE_LOAD_OPTIONS,
    CONTAINER_IMAGE_SAVE_OPTIONS
} from '$lib/helpers/containerization/commands/images';
import { formatJSON } from '$lib/services/containerization/constants';

const command = {
    name: CONTAINER_SUBCOMMANDS.IMAGE,
    image: CONTAINER_IMAGE_SUBCOMMANDS,
    load: CONTAINER_IMAGE_LOAD_OPTIONS,
    save: CONTAINER_IMAGE_SAVE_OPTIONS
};

export async function getAllImages(): Promise<Output> {
    const containerCommand = createContainerCommand([
        command.name,
        command.image.LIST,
        ...formatJSON()
    ]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}

export function createPullImageCommand(imageDetails: Array<string>) {
    return createContainerCommand([command.name, command.image.PULL, ...imageDetails]);
}

export async function pullImage(imageDetails: Array<string>): Promise<Output> {
    const containerCommand = createContainerCommand([
        command.name,
        command.image.PULL,
        ...imageDetails
    ]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}

export async function removeImage(imageReference: string): Promise<Output> {
    return removeMultipleImages([imageReference]);
}

export async function removeMultipleImages(imagesReference: Array<string>): Promise<Output> {
    const containerCommand = createContainerCommand([
        command.name,
        command.image.DELETE,
        imagesReference.join(' ')
    ]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}

export async function inspectImage(imageReference: string): Promise<Output> {
    const containerCommand = createContainerCommand([
        command.name,
        command.image.INSPECT,
        imageReference
    ]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}

export async function importImageFromTar(path: string): Promise<Output> {
    const containerCommand = createContainerCommand([
        command.name,
        command.image.LOAD,
        command.load.INPUT,
        path
    ]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}

export async function exportImageToTar(
    imageReference: string,
    path: string,
    additionalOptions: string[] = []
): Promise<Output> {
    // container i save --arch aarch64 --output /Users/shivammeena/Projects/ContainerKit/static/test-tar.tar redis
    const containerCommand = createContainerCommand([
        command.name,
        command.image.SAVE,
        ...additionalOptions,
        command.save.OUTPUT,
        path,
        imageReference
    ]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}

export { exportImageToTar as saveImage };
