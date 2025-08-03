import { createContainerCommand, validateCommandOutput } from '$lib/services/containerization/utils';
import { commands } from '$lib/models/bindings';
import type { RegistryLoginParams, RegistryLogoutParams } from '$lib/models/container';

export const registryLogin = async (options: RegistryLoginParams) => {
    const args = [
        'registry',
        'login',
        '--username',
        options.username,
        '--password-stdin',
        '--scheme',
        options?.scheme ?? 'auto',
        options.registry
    ];

    const output = await commands.runContainerCommandWithStdin(args, options.password);

    if (output.status === 'ok') {
        return validateCommandOutput(output.data);
    }

    return {
        error: true,
        stderr: output.error,
        stdout: ''
    };
};

export const registryLogout = async (options: RegistryLogoutParams) => {
    const command = createContainerCommand(['registry', 'logout', options.registry]);
    const output = await command.execute();
    return validateCommandOutput(output);
}