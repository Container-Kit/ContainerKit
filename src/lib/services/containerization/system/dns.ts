import { z } from 'zod';
import { commands } from '$lib/models/bindings';
import { CONTAINER_BIN_PATH } from '$lib/helpers/constants';
import { err, ok, parseJson, run, type Result } from '../cli';

export async function listDnsDomains(): Promise<Result<string[]>> {
    const output = await run(['system', 'dns', 'list', '--format', 'json']);
    if (!output.ok) return output;
    return parseJson(output.data.trim() || '[]', z.array(z.string()));
}

// create/delete must run as administrator, so they go through the
// elevated-command path (admin password prompt) with an absolute CLI path
async function runElevatedDns(args: string[]): Promise<Result<string>> {
    const result = await commands.executeWithElevatedCommand(CONTAINER_BIN_PATH, [
        'system',
        'dns',
        ...args
    ]);
    if (result.status !== 'ok') return err(result.error);
    if (result.data.code !== 0) {
        return err(
            result.data.stderr.trim() ||
                `"container system dns ${args.join(' ')}" exited with code ${result.data.code}`
        );
    }
    return ok(result.data.stdout);
}

export function createDnsDomain(domain: string): Promise<Result<string>> {
    return runElevatedDns(['create', domain]);
}

export function removeDnsDomain(domain: string): Promise<Result<string>> {
    return runElevatedDns(['delete', domain]);
}
