import { DEBUG_FLAG, OUTPUT_FORMAT_FLAG } from '../common';

export const CONTAINER_SYSTEM_DNS_SUBCOMMANDS = {
    // USAGE: container system dns [--debug] <subcommand>
    // Create a local DNS domain for containers (must run as an administrator)
    CREATE: 'create',
    // Delete a local DNS domain (must run as an administrator)
    DELETE: 'delete',
    // List local DNS domains
    LIST: 'list'
};

export const CONTAINER_SYSTEM_DNS_CREATE_OPTIONS = {
    // USAGE: container system dns create [--debug] [--localhost <localhost>] <domain-name>
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG,
    // Set the ip address to be redirected to localhost
    LOCALHOST: '--localhost'
};

export const CONTAINER_SYSTEM_DNS_DELETE_OPTIONS = {
    // USAGE: container system dns delete [--debug] <domain-name>
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SYSTEM_DNS_LIST_OPTIONS = {
    // USAGE: container system dns list [--format <format>] [--quiet] [--debug]
    // Format of the output (values: json, table, yaml; default: table)
    ...OUTPUT_FORMAT_FLAG,
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;
