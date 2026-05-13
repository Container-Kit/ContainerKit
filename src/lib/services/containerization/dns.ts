import {
    createContainerCommand,
    validateCommandOutput
} from '$lib/services/containerization/utils';
import type { Output } from '$lib/services/containerization/models';
import { commands } from '$lib/models/bindings';
import { CONTAINER_SUBCOMMANDS } from '$lib/helpers/containerization/commands/container';
import { CONTAINER_SYSTEM_SUBCOMMANDS } from '$lib/helpers/containerization/commands/system/system';
import { CONTAINER_SYSTEM_DNS_SUBCOMMANDS } from '$lib/helpers/containerization/commands/system/dns';
import { formatJSON } from '$lib/services/containerization/constants';

const command = {
    name: CONTAINER_SUBCOMMANDS.SYSTEM,
    subProperty: CONTAINER_SYSTEM_SUBCOMMANDS.DNS,
    dns: CONTAINER_SYSTEM_DNS_SUBCOMMANDS
};

export async function createDns(domain: string): Promise<Output> {
    const output = await commands.executeWithElevatedCommand('container', [
        command.name,
        command.subProperty,
        command.dns.CREATE,
        domain
    ]);

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
    const containerCommand = createContainerCommand([
        command.name,
        command.subProperty,
        command.dns.LIST,
        ...formatJSON()
    ]);
    const output = await containerCommand.execute();
    return validateCommandOutput(output);
};
