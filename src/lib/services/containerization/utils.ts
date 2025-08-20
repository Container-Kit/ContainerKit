import { type ChildProcess, Command } from '@tauri-apps/plugin-shell';
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

export function createContainerCommand(args: string[], sidecar?: false): Command<string> {
    if (sidecar) {
        return Command.sidecar('binaries/sidecar/apple-container/bin/container', args)
    }
   return  Command.create('container', args)
}
