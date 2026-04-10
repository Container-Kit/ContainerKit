import type { ChildProcess } from '@tauri-apps/plugin-shell';
import type { Result } from '../types/result';

export const isSuccessful = (output: ChildProcess<string>): boolean => output.code === 0;

export const hasOutput = (output: ChildProcess<string>): boolean =>
    !!output.stdout && output.stdout.length > 0;

export const isJSON = (text: string): boolean => {
    try {
        JSON.parse(text);
        return true;
    } catch {
        return false;
    }
};

export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

export const validateCommandOutput = (output: ChildProcess<string>): Result<string> =>
    isSuccessful(output) && output.stdout
        ? { tag: 'success', value: output.stdout, warning: output.stderr }
        : {
              tag: 'failure',
              error: 'Command failed',
              stderr: output.stderr || `Exit code: ${output.code}`
          };

export const validateJSON = (text: string): Result<unknown> =>
    isJSON(text)
        ? { tag: 'success', value: JSON.parse(text) }
        : {
              tag: 'failure',
              error: 'Invalid JSON',
              stderr: text.substring(0, 100)
          };

export const validateNonEmpty = <T extends { length: number }>(
    value: T,
    name: string = 'value'
): Result<T> =>
    value.length > 0
        ? { tag: 'success', value }
        : { tag: 'failure', error: `${name} is empty`, stderr: '' };

export const validateThen = <T, E>(
    result: Result<T, E>,
    validator: (value: T) => Result<T, E>
): Result<T, E> => (result.tag === 'success' ? validator(result.value) : result);
