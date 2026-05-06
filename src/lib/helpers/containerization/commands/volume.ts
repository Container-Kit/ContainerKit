import { DEBUG_FLAG, OUTPUT_FORMAT_FLAG } from './common';

export const VOLUME_SUBCOMMANDS = {
    // USAGE: container volume [--debug] <subcommand>
    // Create a new volume
    CREATE: 'create',
    // Delete one or more volumes
    DELETE: 'delete',
    // List volumes
    LIST: 'list',
    // Display information about one or more volumes
    INSPECT: 'inspect',
    // Remove volumes with no container references
    PRUNE: 'prune'
} as const;

export const VOLUME_CREATE_OPTIONS = {
    // USAGE: container volume create [--label <label> ...] [--opt <opt> ...] [-s <s>] [--debug] <name>
    // Set metadata for a volume (format: key=value)
    LABEL: '--label',
    // Set driver specific options (format: key=value)
    OPT: '--opt',
    // Size of the volume in bytes, with optional K, M, G, T, or P suffix
    SIZE: '-s',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const VOLUME_DELETE_OPTIONS = {
    // USAGE: container volume delete [--all] [--debug] [<names> ...]
    // Delete all volumes
    ALL: '--all',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const VOLUME_LIST_OPTIONS = {
    // USAGE: container volume list [--format <format>] [--quiet] [--debug]
    // Set the output format (format: table, json, or raw) (default: table)
    ...OUTPUT_FORMAT_FLAG,
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const VOLUME_INSPECT_OPTIONS = {
    // USAGE: container volume inspect [--debug] <names> ...
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const VOLUME_PRUNE_OPTIONS = {
    // USAGE: container volume prune [--debug]
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;
