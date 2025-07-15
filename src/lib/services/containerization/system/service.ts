import { Command } from '@tauri-apps/plugin-shell';
import { validateCommandOutput } from '$lib/services/containerization/utils';

export async function startContainerization() {
    const command = Command.create('container', ['s', 'start']);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export async function stopContainerization() {
    const command = Command.create('container', ['s', 'stop']);
    const output = await command.execute();
    return validateCommandOutput(output);
}

export async function containerizationStatus() {
    const command = Command.create('container', ['s', 'status']);
    const output = await command.execute();
    return validateCommandOutput(output);
}
