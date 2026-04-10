import { Command, type ChildProcess } from '@tauri-apps/plugin-shell';

export type CommandConfig = {
    readonly command: string;
    readonly args: readonly string[];
    readonly timeout?: number;
};

export const buildCommand = (command: string): CommandConfig => ({
    command,
    args: [],
    timeout: undefined
});

export const withArgs = (config: CommandConfig, ...args: string[]): CommandConfig => ({
    ...config,
    args: [...config.args, ...args]
});

export const withFlag = (config: CommandConfig, flag: string, value?: string): CommandConfig => ({
    ...config,
    args: [...config.args, flag, ...(value ? [value] : [])]
});

export const withTimeout = (config: CommandConfig, timeoutMs: number): CommandConfig => ({
    ...config,
    timeout: timeoutMs
});

export const containerCommand = (args: readonly string[]): CommandConfig =>
    withArgs(buildCommand('container'), ...args);

export const systemCommand = (args: readonly string[]): CommandConfig =>
    withArgs(buildCommand('system'), ...args);

export const executeCommand = async (config: CommandConfig): Promise<ChildProcess<string>> => {
    const cmd = Command.create(config.command, [...config.args]);

    if (!config.timeout) {
        return cmd.execute();
    }

    return Promise.race([
        cmd.execute(),
        new Promise<ChildProcess<string>>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after ${config.timeout}ms`)), config.timeout)
        )
    ]);
};

export const commandToString = (config: CommandConfig): string =>
    `${config.command} ${config.args.join(' ')}`;
