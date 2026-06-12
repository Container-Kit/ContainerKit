import { z } from 'zod';
import { parseJson, run, type Result } from '../cli';

export function startContainerization(): Promise<Result<string>> {
    return run(['system', 'start', '--enable-kernel-install']);
}

export function stopContainerization(): Promise<Result<string>> {
    return run(['system', 'stop']);
}

const SystemStatusSchema = z.looseObject({ status: z.string() });
export type SystemStatus = z.infer<typeof SystemStatusSchema>;

export async function containerizationStatus(): Promise<Result<SystemStatus>> {
    const output = await run(['system', 'status', '--format', 'json']);
    if (!output.ok) return output;
    return parseJson(output.data, SystemStatusSchema);
}
