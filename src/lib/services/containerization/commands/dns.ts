/**
 * @fileoverview DNS command builders
 */

import { buildArgs } from './common';

/**
 * DNS list command
 */
export const listDNSCmd = (options: { format?: 'json' | 'table' } = {}): readonly string[] =>
	buildArgs(['system', 'dns', 'list'], { '--format': options.format }, []);

/**
 * DNS create command
 */
export const createDNSCmd = (domain: string): readonly string[] =>
	buildArgs(['system', 'dns', 'create'], {}, [domain]);

/**
 * DNS remove command
 */
export const removeDNSCmd = (domain: string): readonly string[] =>
	buildArgs(['system', 'dns', 'delete'], {}, [domain]);
