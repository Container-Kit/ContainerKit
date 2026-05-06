import { DEBUG_FLAG } from '../common.js';

export const CONTAINER_SYSTEM_KERNEL_SUBCOMMANDS = {
    // USAGE: container system kernel set [--debug] <kernel-name>
    // Set the default kernel
    SET: 'set'
} as const;

export const CONTAINER_SYSTEM_KERNEL_SET_OPTIONS = {
    // USAGE: container system kernel set [--arch <arch>] [--binary <binary>] [--force] [--recommended] [--tar <tar>] [--debug]
    // The architecture of the kernel binary (values: amd64, arm64) (default: arm64)
    ARCH: '--arch',
    // Path to the kernel file (or archive member, if used with --tar)
    BINARY: '--binary',
    // Overwrites an existing kernel with the same name
    FORCE: '--force',
    // Download and install the recommended kernel as the default (takes precedence over all other flags)
    RECOMMENDED: '--recommended',
    // Filesystem path or remote URL to a tar archive containing a kernel file
    TAR: '--tar',
    ...DEBUG_FLAG
} as const;
