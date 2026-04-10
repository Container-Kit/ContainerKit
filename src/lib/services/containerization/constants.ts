export const COMMANDS = {
    CONTAINER: 'container',
    SYSTEM: 'system',
    IMAGE: 'image'
} as const;

export const CONTAINER_ACTIONS = {
    LIST: 'ls',
    RUN: 'run',
    START: 'start',
    STOP: 'stop',
    REMOVE: 'rm',
    INSPECT: 'inspect',
    LOGS: 'logs',
    CREATE: 'create',
    PAUSE: 'pause',
    UNPAUSE: 'unpause'
} as const;

export const IMAGE_ACTIONS = {
    LIST: 'ls',
    PULL: 'pull',
    REMOVE: 'rm',
    INSPECT: 'inspect',
    SAVE: 'save',
    LOAD: 'load',
    TAG: 'tag',
    BUILD: 'build'
} as const;

export const SYSTEM_ACTIONS = {
    STATUS: 'status',
    START: 'start',
    STOP: 'stop',
    RESTART: 'restart',
    PROPERTY: 'property'
} as const;

export const TIMEOUTS = {
    SHORT: 5000,
    NORMAL: 30000,
    LONG: 300000,
    VERY_LONG: 900000
} as const;

export const CONTAINER_STATES = {
    RUNNING: 'running',
    STOPPED: 'stopped',
    PAUSED: 'paused',
    EXITED: 'exited',
    DEAD: 'dead'
} as const;

export const OUTPUT_FORMATS = {
    JSON: 'json',
    TABLE: 'table'
} as const;

export const formatJSON = (): readonly [string, string] => ['--format', 'json'];

export const getTimeout = (key: keyof typeof TIMEOUTS): number => TIMEOUTS[key];
