/**
 * @fileoverview Volume command builders
 */

import { buildArgs } from './common';

/**
 * Volume list command
 */
export const listVolumesCmd = (
	options: { format?: 'json' | 'table' } = {}
): readonly string[] =>
	buildArgs(['volume', 'ls'], { '--format': options.format || 'json' }, []);

/**
 * Volume create command
 */
export const createVolumeCmd = (volumeName: string): readonly string[] =>
	buildArgs(['volume', 'create'], {}, [volumeName]);

/**
 * Volume remove command
 */
export const removeVolumeCmd = (volumeNames: readonly string[]): readonly string[] =>
	buildArgs(['volume', 'rm'], {}, Array.from(volumeNames));

/**
 * Volume delete command (alias for rm)
 */
export const deleteVolumeCmd = (volumeNames: readonly string[]): readonly string[] =>
	removeVolumeCmd(volumeNames);

/**
 * Volume inspect command
 */
export const inspectVolumeCmd = (volumeName: string): readonly string[] =>
	buildArgs(['volume', 'inspect'], {}, [volumeName]);

/**
 * Volume prune command
 */
export const pruneVolumesCmd = (): readonly string[] =>
	buildArgs(['volume', 'prune'], {}, []);
