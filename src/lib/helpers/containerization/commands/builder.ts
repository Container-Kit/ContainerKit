import { DEBUG_FLAG, OUTPUT_FORMAT_FLAG } from './common';

export const CONTAINER_BUILDER_SUBCOMMANDS = {
    // USAGE: container builder [--debug] <subcommand>
    // Start the builder container
    START: 'start',
    // Display the builder container status
    STATUS: 'status',
    // Stop the builder container
    STOP: 'stop',
    // Delete the builder container
    DELETE: 'delete'
} as const;

export const CONTAINER_BUILDER_START_OPTIONS = {
    // USAGE: container builder start [--cpus <cpus>] [--memory <memory>] [--dns <ip> ...] [--dns-domain <domain>] [--dns-option <option> ...] [--dns-search <domain> ...] [--debug]
    // Number of CPUs to allocate to the builder container
    CPUS: '--cpus',
    // Amount of builder container memory (1MiByte granularity), with optional K, M, G, T, or P suffix
    MEMORY: '--memory',
    // DNS nameserver IP address
    DNS: '--dns',
    // Default DNS domain
    DNS_DOMAIN: '--dns-domain',
    // DNS options
    DNS_OPTION: '--dns-option',
    // DNS search domains
    DNS_SEARCH: '--dns-search',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_BUILDER_DELETE_OPTIONS = {
    // USAGE: container builder delete [--force] [--debug]
    // Delete the builder even if it is running
    FORCE: '--force',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_BUILDER_STATUS_OPTIONS = {
    // USAGE: container builder status [--format <format>] [--quiet] [--debug]
    // Format of the output (values: json, table, yaml; default: table)
    ...OUTPUT_FORMAT_FLAG,
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_BUILDER_STOP_OPTIONS = {
    // USAGE: container builder stop [--debug]
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
};
