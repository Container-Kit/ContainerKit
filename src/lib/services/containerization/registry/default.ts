import { ok, run, type Result } from '../cli';

export async function getDefaultRegistry(): Promise<Result<string>> {
    const output = await run(['registry', 'default', 'inspect']);
    if (!output.ok) return output;
    return ok(output.data.trim());
}

export function setDefaultRegistry(registry: string): Promise<Result<string>> {
    return run(['registry', 'default', 'set', registry]);
}

export function unsetDefaultRegistry(registry: string): Promise<Result<string>> {
    return run(['registry', 'default', 'unset', registry]);
}
