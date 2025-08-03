import { createContainerCommand, validateCommandOutput } from '$lib/services/containerization/utils';

export async function startContainerization() {
    const command = createContainerCommand( ['s', 'start']);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export async function stopContainerization() {
    const command = createContainerCommand( ['s', 'stop']);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export async function containerizationStatus() {
    const command = createContainerCommand( ['s', 'status']);
    const output = await command.execute();
    return validateCommandOutput(output);
}
