import { z } from 'zod';
import { parseJson, run, type Result } from './cli';
import { ContainerNetworkSchema, type ContainerNetwork } from '$lib/models/container';

const NetworkListSchema = z.array(ContainerNetworkSchema);

export async function getAllNetworks(): Promise<Result<ContainerNetwork[]>> {
    const output = await run(['network', 'list', '--format', 'json']);
    if (!output.ok) return output;
    // empty stdout means no networks, not an error
    return parseJson(output.data.trim() || '[]', NetworkListSchema);
}

export function createNetwork(name: string, subnet?: string): Promise<Result<string>> {
    const args = ['network', 'create'];
    if (subnet) args.push('--subnet', subnet);
    args.push(name);
    return run(args);
}

export function removeNetwork(name: string): Promise<Result<string>> {
    return run(['network', 'delete', name]);
}
