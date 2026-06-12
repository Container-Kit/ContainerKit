import { z } from 'zod';
import { parseJson, run, type Result } from './cli';
import { ContainerClientSchema, type ContainerClient } from '$lib/models/container';

const ContainerListSchema = z.array(ContainerClientSchema);

export async function getAllContainers(): Promise<Result<ContainerClient[]>> {
    const output = await run(['list', '--all', '--format', 'json']);
    if (!output.ok) return output;
    // empty stdout means no containers, not an error
    return parseJson(output.data.trim() || '[]', ContainerListSchema);
}

export function startContainer(id: string): Promise<Result<string>> {
    return run(['start', id]);
}

export function stopContainer(id: string): Promise<Result<string>> {
    return run(['stop', id]);
}

export function removeContainer(id: string): Promise<Result<string>> {
    return run(['rm', id]);
}

export async function inspectContainer(id: string): Promise<Result<unknown>> {
    const output = await run(['inspect', id]);
    if (!output.ok) return output;
    return parseJson(output.data, z.unknown());
}

export function getContainerLogs(id: string): Promise<Result<string>> {
    return run(['logs', id]);
}
