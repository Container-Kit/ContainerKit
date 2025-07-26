import { Command } from '@tauri-apps/plugin-shell';
import { validateCommandOutput } from '$lib/services/containerization/utils';

export const getDefaultRegistry = async () => {
    const command = Command.create('container', ['registry', 'default', 'inspect']);
    const output = await command.execute();
    return validateCommandOutput(output);
};

export const setDefaultRegistry = async (registry: string) => {
    const command = Command.create('container', ['registry', 'default', 'set', registry]);
    const output = await command.execute();
    return validateCommandOutput(output);
};

export const unsetDefaultRegistry = async (registry: string) => {
    const command = Command.create('container', ['registry', 'default', 'unset', registry]);
    const output = await command.execute();
    return validateCommandOutput(output);
};

export const removeDefaultRegistry = unsetDefaultRegistry;
export const clearDefaultRegistry = unsetDefaultRegistry;
