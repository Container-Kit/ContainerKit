import { DEBUG_FLAG, OUTPUT_FORMAT_FLAG } from '../common';

export const CONTAINER_SYSTEM_PROPERTY_SUBCOMMANDS = {
    // USAGE: container system property [--debug] <subcommand>
    // Clear a property value
    CLEAR: 'clear',
    // Retrieve a property value
    GET: 'get',
    // List system properties
    LIST: 'list',
    // Set a property value
    SET: 'set'
} as const;

export const CONTAINER_SYSTEM_PROPERTY_OPTIONS = {
    // USAGE: container system property <subcommand> [--debug]
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SYSTEM_PROPERTY_GET_OPTIONS = {
    // USAGE: container system property get [--debug] <id>
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SYSTEM_PROPERTY_CLEAR_OPTIONS = {
    // USAGE: container system property clear [--debug] <id>
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SYSTEM_PROPERTY_SET_OPTIONS = {
    // USAGE: container system property set [--debug] <id> <value>
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SYSTEM_PROPERTY_LIST_OPTIONS = {
    // USAGE: container system property list [--format <format>] [--quiet] [--debug]
    // Format of the output (values: json, table, yaml; default: table)
    ...OUTPUT_FORMAT_FLAG,
    ...DEBUG_FLAG
} as const;
