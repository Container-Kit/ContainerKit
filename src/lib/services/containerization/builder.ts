import { z } from 'zod';
import { parseJson, run, type Result } from './cli';

// `builder status --format json` returns [] when no builder container exists,
// otherwise one container-shaped entry
const BuilderStatusSchema = z.array(
    z.looseObject({
        status: z.looseObject({ state: z.string() }).optional()
    })
);

export type BuilderState = 'running' | 'stopped' | 'none';

export async function builderStatus(): Promise<Result<BuilderState>> {
    const output = await run(['builder', 'status', '--format', 'json']);
    if (!output.ok) return output;
    const parsed = parseJson(output.data.trim() || '[]', BuilderStatusSchema);
    if (!parsed.ok) return parsed;
    const builder = parsed.data.at(0);
    if (!builder) return { ok: true, data: 'none' };
    return { ok: true, data: builder.status?.state === 'running' ? 'running' : 'stopped' };
}

export function startBuilder(
    options: { cpus?: string; memory?: string } = {}
): Promise<Result<string>> {
    const args = ['builder', 'start'];
    if (options.cpus) args.push('--cpus', options.cpus);
    if (options.memory) args.push('--memory', options.memory);
    return run(args);
}

export function stopBuilder(): Promise<Result<string>> {
    return run(['builder', 'stop']);
}

export function removeBuilder(): Promise<Result<string>> {
    return run(['builder', 'delete']);
}
