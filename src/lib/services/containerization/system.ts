import { Command } from '@tauri-apps/plugin-shell';
import { validateCommandOutput } from '$lib/services/containerization/utils';

export async function startContainerization() {
    const command = Command.create('container', ['s', 'start']);
    const output = await command.execute();
    return validateCommandOutput(output);
}
