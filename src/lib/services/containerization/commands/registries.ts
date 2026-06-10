/**
 * @fileoverview Registry command builders
 */

import { buildArgs } from './common';

/**
 * Registry list command
 */
export const listRegistriesCmd = (
	options: { format?: 'json' | 'table' } = {}
): readonly string[] =>
	buildArgs(['registry', 'ls'], { '--format': options.format || 'json' }, []);

/**
 * Registry login command
 */
export const registryLoginCmd = (
	registry: string,
	options: { username?: string; password?: string } = {}
): readonly string[] => {
	const opts: Record<string, string | undefined> = {};
	if (options.username) opts['--username'] = options.username;
	if (options.password) opts['--password'] = options.password;
	return buildArgs(['registry', 'login'], opts, [registry]);
};

/**
 * Registry logout command
 */
export const registryLogoutCmd = (registry: string): readonly string[] =>
	buildArgs(['registry', 'logout'], {}, [registry]);
