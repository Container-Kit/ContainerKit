/**
 * @fileoverview Container command builders
 */

import { buildArgs } from './common';

/**
 * Container list command
 */
export const listContainersCmd = (
	options: { all?: boolean; format?: 'json' | 'table'; quiet?: boolean } = {}
): readonly string[] =>
	buildArgs(
		['list'],
		{
			'--all': options.all,
			'--format': options.format || 'json',
			'--quiet': options.quiet
		},
		[]
	);

/**
 * Container create command
 */
export const createContainerCmd = (
	imageRef: string,
	options: { name?: string } = {}
): readonly string[] => {
	const opts: Record<string, string | undefined> = {};
	if (options.name) opts['--name'] = options.name;
	return buildArgs(['create'], opts, [imageRef]);
};

/**
 * Container run command
 */
export const runContainerCmd = (
	imageRef: string,
	options: { name?: string; detach?: boolean; interactive?: boolean; tty?: boolean } = {}
): readonly string[] => {
	const opts: Record<string, string | boolean | undefined> = {};
	if (options.name) opts['--name'] = options.name;
	if (options.detach) opts['--detach'] = true;
	if (options.interactive) opts['-i'] = true;
	if (options.tty) opts['-t'] = true;
	return buildArgs(['run'], opts, [imageRef]);
};

/**
 * Container start command
 */
export const startContainerCmd = (containerId: string): readonly string[] =>
	buildArgs(['start'], {}, [containerId]);

/**
 * Container stop command
 */
export const stopContainerCmd = (containerId: string): readonly string[] =>
	buildArgs(['stop'], {}, [containerId]);

/**
 * Container remove command
 */
export const removeContainerCmd = (
	containerIds: readonly string[],
	force: boolean = false
): readonly string[] => buildArgs(['rm'], { '--force': force }, Array.from(containerIds));

/**
 * Container delete command (alias for rm)
 */
export const deleteContainerCmd = (
	containerIds: readonly string[],
	force: boolean = false
): readonly string[] => removeContainerCmd(containerIds, force);

/**
 * Container inspect command
 */
export const inspectContainerCmd = (containerId: string): readonly string[] =>
	buildArgs(['inspect'], {}, [containerId]);

/**
 * Container logs command
 */
export const logsContainerCmd = (
	containerId: string,
	options: { follow?: boolean; tail?: number } = {}
): readonly string[] =>
	buildArgs(
		['logs'],
		{
			'--follow': options.follow,
			'--tail': options.tail?.toString()
		},
		[containerId]
	);

/**
 * Container exec command
 */
export const execContainerCmd = (
	containerId: string,
	command: readonly string[],
	options: { interactive?: boolean; tty?: boolean } = {}
): readonly string[] => {
	const opts: Record<string, boolean | undefined> = {};
	if (options.interactive) opts['-i'] = true;
	if (options.tty) opts['-t'] = true;
	return buildArgs(['exec'], opts, [containerId, ...command]);
};

/**
 * Container copy command
 */
export const copyContainerCmd = (source: string, destination: string): readonly string[] =>
	buildArgs(['cp'], {}, [source, destination]);

/**
 * Container kill command
 */
export const killContainerCmd = (
	containerIds: readonly string[],
	signal?: string
): readonly string[] => {
	const opts: Record<string, string | undefined> = {};
	if (signal) opts['--signal'] = signal;
	return buildArgs(['kill'], opts, Array.from(containerIds));
};

/**
 * Container export command
 */
export const exportContainerCmd = (
	containerId: string,
	outputPath: string
): readonly string[] => buildArgs(['export'], { '--output': outputPath }, [containerId]);

/**
 * Container stats command
 */
export const statsContainerCmd = (
	containerIds: readonly string[] = [],
	options: { stream?: boolean; format?: 'json' | 'table' } = {}
): readonly string[] => {
	const opts: Record<string, string | boolean | undefined> = {};
	if (options.stream !== undefined) opts['--stream'] = options.stream;
	if (options.format) opts['--format'] = options.format;
	return buildArgs(['stats'], opts, Array.from(containerIds));
};

/**
 * Container prune command
 */
export const pruneContainersCmd = (force?: boolean): readonly string[] =>
	buildArgs(['prune'], { '--force': force }, []);
