import { DEBUG_FLAG, OUTPUT_FORMAT_FLAG } from './common';

export const CONTAINER_NETWORK_SUBCOMMANDS = {
    // USAGE: container network [--debug] <subcommand>
    // Create a new network
    CREATE: 'create',
    // Delete one or more networks
    DELETE: 'delete',
    // List networks
    LIST: 'list',
    // Display information about one or more networks
    INSPECT: 'inspect',
    // Remove networks with no container connections
    PRUNE: 'prune'
} as const;

export const CONTAINER_NETWORK_CREATE_OPTIONS = {
    // USAGE: container network create [--label <label> ...] [--internal] [--subnet <subnet>] [--subnet-v6 <subnet-v6>] [--plugin <plugin>] [--plugin-variant <plugin-variant>] [--debug] <name>
    // Set metadata for a network (format: key=value)
    LABEL: '--label',
    // Restrict to host-only network
    INTERNAL: '--internal',
    // Set subnet for a network
    SUBNET: '--subnet',
    // Set the IPv6 prefix for a network
    SUBNET_V6: '--subnet-v6',
    // Set the plugin to use to create this network. (default: container-network-vmnet)
    PLUGIN: '--plugin',
    // Set the variant of the network plugin to use.
    PLUGIN_VARIANT: '--plugin-variant',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_NETWORK_DELETE_OPTIONS = {
    // USAGE: container network delete [--all] [--debug] [<network-names> ...]
    // Delete all networks
    ALL: '--all',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
};

export const CONTAINER_NETWORK_LIST_OPTIONS = {
    // USAGE: container network list [--format <format>] [--quiet] [--debug]
    // Format of the output (values: json, table, yaml; default: table)
    ...OUTPUT_FORMAT_FLAG,
    // Only output the network name
    QUIET: '--quiet',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_NETWORK_INSPECT_OPTIONS = {
    // USAGE: container network inspect <networks> ... [--debug]
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_NETWORK_PRUNE_OPTIONS = {
    // USAGE: container network prune [--debug]
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;
