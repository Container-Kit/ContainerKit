import {
    createContainerCommand,
    validateCommandOutput
} from '$lib/services/containerization/utils';
import type { Output } from '$lib/services/containerization/models';
import { commands } from '$lib/models/bindings';

export async function createDns(domain: string): Promise<Output> {
    const output = await commands.executeWithElevatedCommand('container', ['s', 'dns', 'create', domain]);
    if (output.status === 'ok') {
        return validateCommandOutput(output.data);
    }

    return {
        error: true,
        stderr: output.error,
        stdout: ''
    };
}

export const getAllDnsConfig = async (): Promise<Output> => {
    /**
     * Container doesn't have json format output. stdout have string seperated with spaces `test test1 test2`
     * */
    const command = createContainerCommand(['s', 'dns', 'ls']);
    const output = await command.execute();
    return validateCommandOutput(output);
};
