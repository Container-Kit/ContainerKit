import type { ChildProcess } from '@tauri-apps/plugin-shell';
import type { Output } from './models.js';

export function validateCommandOutput(output: ChildProcess<string>): Output {
    if (output.code === null) {
        return {
            error: true,
            stderr: output.stderr,
            stdout: output.stdout
        };
    }

    if (!output.stdout) {
        return {
            error: true,
            stderr: output.stderr,
            stdout: output.stdout
        };
    }

    return {
        error: false,
        stderr: output.stderr,
        stdout: output.stdout
    };
}
