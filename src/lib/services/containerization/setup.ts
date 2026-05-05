import {
    createContainerCommand,
    validateCommandOutput
} from '$lib/services/containerization/utils';
import { commands } from '$lib/models/bindings';

import {
    CONTAINER_API_SERVER_BIN_PATH,
    CONTAINER_API_SERVER_PATH,
    CONTAINER_BIN_PATH,
    CONTAINER_BINARIES_PATH,
    CONTAINER_LIBEXEC_PATH,
    LIBEXEC_PATH
} from '$lib/helpers/constants';
import { resourceDir } from '@tauri-apps/api/path';
import type { Output } from '$lib/services/containerization/models';

export async function hasContainerCli() {
    const command = createContainerCommand([]);
    try {
        await command.execute();
    } catch (error) {
        console.log('Unable to find container command', error);
        return false;
    }
    return true;
}

export async function createSymlink() {
    const resourceDirPath = await resourceDir();

    const bins = {
        [`${resourceDirPath}${CONTAINER_BINARIES_PATH}`]: CONTAINER_BIN_PATH,
        [`${resourceDirPath}${CONTAINER_API_SERVER_PATH}`]: CONTAINER_API_SERVER_BIN_PATH,
        [`${resourceDirPath}${CONTAINER_LIBEXEC_PATH}`]: LIBEXEC_PATH
    };

    let shellCommands = `${LIBEXEC_PATH}`; // Start with cleanup

    for (const [resource, linkPath] of Object.entries(bins)) {
        shellCommands += ` && sudo ln -sf ${resource} ${linkPath}`;
    }

    const output = await commands.executeWithElevatedCommand('rm', ['-rf', shellCommands]);
    if (output.status === 'ok') {
        return {
            error: false,
            stderr: '',
            stdout: ''
        } as Output;
    }

    return {
        error: true,
        stderr: output.error,
        stdout: ''
    } as Output;
}

export function checkForDefaultNetwork() {}

export function checkForDefaultDNS() {}
