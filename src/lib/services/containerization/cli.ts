import { Command } from '@tauri-apps/plugin-shell';
import { z } from 'zod';

/**
 * Result of a containerization operation. `ok: false` carries a
 * human-readable error message (stderr or a parse/validation failure).
 */
export type Result<T> =
    | { readonly ok: true; readonly data: T }
    | { readonly ok: false; readonly error: string };

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const err = (error: string): Result<never> => ({ ok: false, error });

/**
 * Execute `container <args>`. Succeeds only on exit code 0; data is raw stdout.
 * Never throws — spawn failures become an err Result.
 */
export async function run(args: string[]): Promise<Result<string>> {
    try {
        const output = await Command.create('container', args).execute();
        if (output.code !== 0) {
            return err(
                output.stderr.trim() ||
                    `"container ${args.join(' ')}" exited with code ${output.code}`
            );
        }
        return ok(output.stdout);
    } catch (e) {
        return err(e instanceof Error ? e.message : String(e));
    }
}

/**
 * Parse text as JSON and validate it against a zod schema, so callers get
 * typed data instead of a raw stdout string.
 */
export function parseJson<S extends z.ZodType>(text: string, schema: S): Result<z.infer<S>> {
    let value: unknown;
    try {
        value = JSON.parse(text);
    } catch {
        return err('Command did not return valid JSON');
    }
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
        return err(`Unexpected output shape: ${z.prettifyError(parsed.error)}`);
    }
    return ok(parsed.data);
}
