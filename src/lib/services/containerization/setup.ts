import { Command } from '@tauri-apps/plugin-shell';
import { ok, type Result } from './cli';

// No-op: CLI is installed system-wide via the official Apple installer
export async function createSymlink(): Promise<Result<string>> {
    return ok('');
}

export async function hasContainerCli(): Promise<boolean> {
    try {
        const output = await Command.create('container', ['--version']).execute();
        return output.code === 0;
    } catch {
        return false;
    }
}
