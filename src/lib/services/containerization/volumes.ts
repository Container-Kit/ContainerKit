import { z } from 'zod';
import { parseJson, run, type Result } from './cli';
import { ContainerVolumeSchema, type ContainerVolume } from '$lib/models/container';

const VolumeListSchema = z.array(ContainerVolumeSchema);

export async function getAllVolumes(): Promise<Result<ContainerVolume[]>> {
    const output = await run(['volume', 'list', '--format', 'json']);
    if (!output.ok) return output;
    // empty stdout means no volumes, not an error
    return parseJson(output.data.trim() || '[]', VolumeListSchema);
}

export function createVolume(name: string, size?: string): Promise<Result<string>> {
    const args = ['volume', 'create'];
    if (size) args.push('-s', size);
    args.push(name);
    return run(args);
}

export function removeVolume(name: string): Promise<Result<string>> {
    return run(['volume', 'delete', name]);
}
