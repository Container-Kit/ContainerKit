import { OUTPUT_FLAG, OUTPUT_FORMAT } from '$lib/helpers/containerization/commands/common.js';

export const TIMEOUTS = {
    SHORT: 5000,
    NORMAL: 30000,
    LONG: 300000,
    VERY_LONG: 900000
} as const;

export const formatJSON = (): readonly [string, string] => [OUTPUT_FLAG, OUTPUT_FORMAT.JSON];

export const getTimeout = (key: keyof typeof TIMEOUTS): number => TIMEOUTS[key];
