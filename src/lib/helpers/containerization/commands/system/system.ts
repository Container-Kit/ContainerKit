import { DEBUG_FLAG, OUTPUT_FORMAT_FLAG } from '../common';

export const CONTAINER_SYSTEM_SUBCOMMANDS = {
    // USAGE: container system [--debug] <subcommand>
    // Show disk usage for images, containers, and volumes
    DF: 'df',
    // Manage local DNS domains
    DNS: 'dns',
    // Manage the default kernel configuration
    KERNEL: 'kernel',
    // Fetch system logs for `container` services
    LOGS: 'logs',
    // Manage system property values
    PROPERTY: 'property',
    // Start `container` services
    START: 'start',
    // Show the status of `container` services
    STATUS: 'status',
    // Stop all `container` services
    STOP: 'stop',
    // Show version information
    VERSION: 'version'
};

export const CONTAINER_SYSTEM_DF_OPTIONS = {
    // USAGE: container system df [--format <format>] [--debug]
    ...OUTPUT_FORMAT_FLAG,
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SYSTEM_VERSION_OPTIONS = {
    // USAGE: container system version [--format <format>] [--debug]
    ...OUTPUT_FORMAT_FLAG,
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SYSTEM_LOGS_OPTIONS = {
    // USAGE: container system logs [--follow] [--last <last>] [--debug]
    // Follow log output
    FOLLOW: '--follow',
    // Fetch logs starting from the specified time period (minus the current time); supported formats: m, h, d (default: 5m)
    LAST: '--last',
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SYSTEM_START_OPTIONS = {
    // USAGE: container system start [--app-root <app-root>] [--install-root <install-root>] [--log-root <log-root>] [--enable-kernel-install] [--disable-kernel-install] [--timeout <timeout>] [--debug]
    // Path to the root directory for application data
    APP_ROOT: '--app-root',
    // Path to the root directory for application executables and plugins
    INSTALL_ROOT: '--install-root',
    // Path to the root directory for log data, using macOS log facility if not set
    LOG_ROOT: '--log-root',
    // Specify whether the default kernel should be installed or not (default: prompt user)
    ENABLE_KERNEL_INSTALL: '--enable-kernel-install',
    DISABLE_KERNEL_INSTALL: '--disable-kernel-install',
    // Number of seconds to wait for API service to become responsive
    TIMEOUT: '--timeout',
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SYSTEM_STATUS_OPTIONS = {
    // USAGE: container system status [--prefix <prefix>] [--format <format>] [--debug]
    // Launchd prefix for services (default: com.apple.container.)
    PREFIX: '--prefix',
    ...OUTPUT_FORMAT_FLAG,
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SYSTEM_STOP_OPTIONS = {
    // USAGE: container system stop [--prefix <prefix>] [--debug]
    // Launchd prefix for services (default: com.apple.container.)
    PREFIX: '--prefix',
    ...DEBUG_FLAG
} as const;
