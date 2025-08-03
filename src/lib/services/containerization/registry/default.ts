import { createContainerCommand, validateCommandOutput } from '$lib/services/containerization/utils';

export const getDefaultRegistry = async () => {
    const command = createContainerCommand( ['registry', 'default', 'inspect']);
    const output = await command.execute();
    return validateCommandOutput(output);
};

export const setDefaultRegistry = async (registry: string) => {
    const command = createContainerCommand( ['registry', 'default', 'set', registry]);
    const output = await command.execute();
    return validateCommandOutput(output);
};

export const unsetDefaultRegistry = async (registry: string) => {
    const command = createContainerCommand( ['registry', 'default', 'unset', registry]);
    const output = await command.execute();
    return validateCommandOutput(output);
};

export const removeDefaultRegistry = unsetDefaultRegistry;
export const clearDefaultRegistry = unsetDefaultRegistry;
