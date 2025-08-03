import { Command } from '@tauri-apps/plugin-shell';
import { createContainerCommand, validateCommandOutput } from '$lib/services/containerization/utils';
import type { Output } from '$lib/services/containerization/models';

export async function getAllImages(): Promise<Output> {
    const command = createContainerCommand(['image', 'ls', '--format', 'json']);
    const output = await command.execute();
    return validateCommandOutput(output);
}
