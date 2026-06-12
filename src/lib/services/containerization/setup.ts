import { Command } from '@tauri-apps/plugin-shell';
import { resourceDir } from '@tauri-apps/api/path';
import { commands } from '$lib/models/bindings';
import {
    BIN_PATH,
    CONTAINER_API_SERVER_BIN_PATH,
    CONTAINER_API_SERVER_PATH,
    CONTAINER_BIN_PATH,
    CONTAINER_BINARIES_PATH,
    CONTAINER_BINARY_UNINSTALL_PATH,
    CONTAINER_LIBEXEC_PATH,
    LIBEXEC_PATH
} from '$lib/helpers/constants';
import { err, ok, type Result } from './cli';

/**
 * Symlink the bundled container CLI into /usr/local so it's available
 * system-wide (mirrors scripts/symlink.sh). Runs as a single elevated
 * shell invocation so macOS asks for the administrator password once.
 */
export async function createSymlink(): Promise<Result<string>> {
    const resources = await resourceDir();

    const script = [
        `mkdir -p '${BIN_PATH}'`,
        `ln -sf '${resources}${CONTAINER_BINARIES_PATH}' '${CONTAINER_BIN_PATH}'`,
        `ln -sf '${resources}${CONTAINER_API_SERVER_PATH}' '${CONTAINER_API_SERVER_BIN_PATH}'`,
        `ln -sf '${resources}${CONTAINER_BINARY_UNINSTALL_PATH}' '${BIN_PATH}/uninstall-container.sh'`,
        // /usr/local/libexec must BE the symlink, not contain one
        `rm -rf '${LIBEXEC_PATH}'`,
        `ln -s '${resources}${CONTAINER_LIBEXEC_PATH}' '${LIBEXEC_PATH}'`
    ].join(' && ');

    const result = await commands.executeWithElevatedCommand('/bin/sh', ['-c', script]);
    if (result.status !== 'ok') return err(result.error);
    if (result.data.code !== 0) {
        return err(
            result.data.stderr.trim() || `Symlink script exited with code ${result.data.code}`
        );
    }
    return ok(result.data.stdout);
}

export async function hasContainerCli(): Promise<boolean> {
    try {
        const output = await Command.create('container', ['--version']).execute();
        return output.code === 0;
    } catch {
        return false;
    }
}
