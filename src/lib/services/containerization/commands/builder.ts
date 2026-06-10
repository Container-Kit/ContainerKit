/**
 * @fileoverview Builder command builders
 */

import { buildArgs } from './common';

/**
 * Builder start command
 */
export const startBuilderCmd = (): readonly string[] => buildArgs(['builder', 'start'], {}, []);

/**
 * Builder stop command
 */
export const stopBuilderCmd = (): readonly string[] => buildArgs(['builder', 'stop'], {}, []);

/**
 * Builder status command
 */
export const builderStatusCmd = (): readonly string[] =>
	buildArgs(['builder', 'status'], {}, []);

/**
 * Builder delete command
 */
export const deleteBuilderCmd = (): readonly string[] => buildArgs(['builder', 'rm'], {}, []);

/**
 * Builder remove command (alias for delete)
 */
export const removeBuilderCmd = (): readonly string[] => deleteBuilderCmd();
