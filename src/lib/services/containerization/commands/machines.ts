/**
 * @fileoverview Machine command builders
 */

import { buildArgs } from './common';

/**
 * Machine list command
 */
export const listMachinesCmd = (
	options: { format?: 'json' | 'table' } = {}
): readonly string[] =>
	buildArgs(['machine', 'ls'], { '--format': options.format || 'json' }, []);

/**
 * Machine create command
 */
export const createMachineCmd = (
	imageRef: string,
	options: { name?: string; cpus?: number; memory?: string } = {}
): readonly string[] => {
	const opts: Record<string, string | undefined> = {};
	if (options.name) opts['--name'] = options.name;
	if (options.cpus) opts['--cpus'] = options.cpus.toString();
	if (options.memory) opts['--memory'] = options.memory;
	return buildArgs(['machine', 'create'], opts, [imageRef]);
};

/**
 * Machine delete command
 */
export const deleteMachineCmd = (machineNames: readonly string[]): readonly string[] =>
	buildArgs(['machine', 'rm'], {}, Array.from(machineNames));

/**
 * Machine remove command (alias for delete)
 */
export const removeMachineCmd = (machineNames: readonly string[]): readonly string[] =>
	deleteMachineCmd(machineNames);

/**
 * Machine inspect command
 */
export const inspectMachineCmd = (machineName: string): readonly string[] =>
	buildArgs(['machine', 'inspect'], {}, [machineName]);

/**
 * Machine run command
 */
export const runMachineCmd = (
	machineName: string,
	command: readonly string[]
): readonly string[] =>
	buildArgs(['machine', 'run'], { '--name': machineName }, Array.from(command));

/**
 * Machine stop command
 */
export const stopMachineCmd = (machineName: string): readonly string[] =>
	buildArgs(['machine', 'stop'], {}, [machineName]);

/**
 * Machine set command
 */
export const setMachineCmd = (
	machineName: string,
	properties: Record<string, string>
): readonly string[] => {
	const args: string[] = ['machine', 'set', '-n', machineName];
	Object.entries(properties).forEach(([key, value]) => {
		args.push(`${key}=${value}`);
	});
	return args;
};

/**
 * Machine set-default command
 */
export const setDefaultMachineCmd = (machineName: string): readonly string[] =>
	buildArgs(['machine', 'set-default'], {}, [machineName]);

/**
 * Machine logs command
 */
export const machineLogsCmd = (machineName: string): readonly string[] =>
	buildArgs(['machine', 'logs'], {}, [machineName]);
