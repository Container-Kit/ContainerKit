import type { Output } from './models';
import { createContainerCommand, validateCommandOutput } from './utils';

export async function createContainer(name: string, image: string): Promise<void> {
    // const command = new Command(`docker create --name ${name} ${image}`);
    // await command.execute();
}

export async function getAllContainers(): Promise<Output> {
    const command = createContainerCommand(['ls', '-a', '--format', 'json']);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export async function startContainer(id: string): Promise<Output> {
    const command = createContainerCommand(['start', id]);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export async function stopContainer(id: string): Promise<Output> {
    const command = createContainerCommand(['stop', id]);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export async function removeContainer(id: string): Promise<Output> {
    const command = createContainerCommand(['rm', id]);
    const output = await command.execute();
    return validateCommandOutput(output);
}

// export async function getContainerLogs(id: string): Promise<Output> {
//     const command = createContainerCommand(['ls', id]);
// }
