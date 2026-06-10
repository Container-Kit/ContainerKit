/**
 * @fileoverview System command builders
 */

import { buildArgs } from './common';

/**
 * System version command
 */
export const versionCmd = (): readonly string[] => buildArgs(['system', 'version'], {}, []);

/**
 * System status command
 */
export const statusCmd = (): readonly string[] => buildArgs(['system', 'status'], {}, []);

/**
 * System df command (disk usage)
 */
export const systemDfCmd = (options: { format?: 'json' | 'table' } = {}): readonly string[] =>
	buildArgs(['system', 'df'], { '--format': options.format }, []);

/**
 * System logs command
 */
export const systemLogsCmd = (): readonly string[] => buildArgs(['system', 'logs'], {}, []);

/**
 * System start command
 */
export const systemStartCmd = (): readonly string[] => buildArgs(['system', 'start'], {}, []);

/**
 * System stop command
 */
export const systemStopCmd = (): readonly string[] => buildArgs(['system', 'stop'], {}, []);
