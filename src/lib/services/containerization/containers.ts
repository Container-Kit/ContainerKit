import type { Output } from './models';
import { createContainerCommand, validateCommandOutput } from './utils';
import {
    CONTAINER_SUBCOMMAND_LIST,
    CONTAINER_SUBCOMMANDS
} from '$lib/helpers/containerization/commands/container';
import { formatJSON } from '$lib/services/containerization/constants';

const command = {
    name: CONTAINER_SUBCOMMANDS,
    list: CONTAINER_SUBCOMMAND_LIST
};

export async function createContainer(name: string, image: string): Promise<void> {
    // const command = new Command(`docker create --name ${name} ${image}`);
    // await command.execute();
}

export async function getAllContainers(): Promise<Output> {
    const containerCommand = createContainerCommand([
        command.name.LIST,
        command.list.ALL,
        ...formatJSON()
    ]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}

export async function startContainer(id: string): Promise<Output> {
    const containerCommand = createContainerCommand([command.name.START, id]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}

export async function stopContainer(id: string): Promise<Output> {
    const containerCommand = createContainerCommand([command.name.STOP, id]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}

export async function removeContainer(id: string): Promise<Output> {
    const containerCommand = createContainerCommand([command.name.REMOVE, id]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}

export async function inspectContainer(id: string): Promise<Output> {
    const containerCommand = createContainerCommand([command.name.INSPECT, id]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}

export async function getContainerLogs(id: string): Promise<Output> {
    const containerCommand = createContainerCommand([command.name.LOGS, id]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
}
