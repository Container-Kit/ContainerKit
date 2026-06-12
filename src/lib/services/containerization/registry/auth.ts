import { commands } from '$lib/models/bindings';
import { err, ok, run, type Result } from '../cli';
import type { RegistryLoginParams, RegistryLogoutParams } from '$lib/models/container';

// login goes through the Rust side so the password can be piped via stdin
export async function registryLogin(options: RegistryLoginParams): Promise<Result<string>> {
    const args = [
        'registry',
        'login',
        '--username',
        options.username,
        '--password-stdin',
        '--scheme',
        options.scheme ?? 'auto',
        options.registry
    ];

    const result = await commands.runContainerCommandWithStdin(args, options.password);
    if (result.status !== 'ok') return err(result.error);
    if (result.data.code !== 0) {
        return err(result.data.stderr || `registry login exited with code ${result.data.code}`);
    }
    return ok(result.data.stdout ?? '');
}

export function registryLogout(options: RegistryLogoutParams): Promise<Result<string>> {
    return run(['registry', 'logout', options.registry]);
}
