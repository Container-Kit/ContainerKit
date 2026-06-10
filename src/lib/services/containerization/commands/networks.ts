/**
 * @fileoverview Network command builders
 */

import { buildArgs } from './common';

/**
 * Network list command
 */
export const listNetworksCmd = (
	options: { format?: 'json' | 'table' } = {}
): readonly string[] =>
	buildArgs(['network', 'ls'], { '--format': options.format || 'json' }, []);

/**
 * Network create command
 */
export const createNetworkCmd = (networkName: string): readonly string[] =>
	buildArgs(['network', 'create'], {}, [networkName]);

/**
 * Network remove command
 */
export const removeNetworkCmd = (networkNames: readonly string[]): readonly string[] =>
	buildArgs(['network', 'rm'], {}, Array.from(networkNames));

/**
 * Network delete command (alias for rm)
 */
export const deleteNetworkCmd = (networkNames: readonly string[]): readonly string[] =>
	removeNetworkCmd(networkNames);

/**
 * Network inspect command
 */
export const inspectNetworkCmd = (networkName: string): readonly string[] =>
	buildArgs(['network', 'inspect'], {}, [networkName]);

/**
 * Network prune command
 */
export const pruneNetworksCmd = (): readonly string[] =>
	buildArgs(['network', 'prune'], {}, []);
