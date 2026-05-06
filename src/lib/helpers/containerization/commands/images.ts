import { DEBUG_FLAG } from './common';

export const CONTAINER_IMAGE_SUBCOMMANDS = {
    // USAGE: container image [--debug] <subcommand>
    // Delete one or more images
    DELETE: 'delete',
    // Display information about one or more images
    INSPECT: 'inspect',
    // List images
    LIST: 'list',
    LS: 'ls',
    // Load images from an OCI compatible tar archive
    LOAD: 'load',
    // Remove all dangling images. If -a is specified, also remove all images not referenced by any container.
    PRUNE: 'prune',
    // Pull an image
    PULL: 'pull',
    // Push an image
    PUSH: 'push',
    // Save one or more images as an OCI compatible tar archive
    SAVE: 'save',
    // Create a new reference for an existing image
    TAG: 'tag'
};

export const CONTAINER_IMAGE_DELETE_OPTIONS = {
    // USAGE: container image delete [--all] [--force] [<images> ...] [--debug]
    // Delete all images
    ALL: '--all',
    // Ignore errors for images that are not found
    FORCE: '--force',
    // Enable debug output [environment: CONTAINER_DEBUG]
    DEBUG: '--debug'
};

export const CONTAINER_IMAGE_INSPECT_OPTIONS = {
    // USAGE: container image inspect [--debug] <images> ...
    // Enable debug output [environment: CONTAINER_DEBUG]
    DEBUG: '--debug'
};

export const CONTAINER_IMAGE_LOAD_OPTIONS = {
    // USAGE: container image load [--input <input>] [--force] [--debug]
    // Path to the image tar archive
    INPUT: '--input',
    // Load images even if the archive contains invalid files
    FORCE: '--force',
    // Enable debug output [environment: CONTAINER_DEBUG]
    DEBUG: '--debug'
};

export const CONTAINER_IMAGE_PRUNE_OPTIONS = {
    // USAGE: container image prune [--debug] [--all]
    // Remove all unused images, not just dangling ones
    ALL: '--all',
    // Do not prompt for confirmation
    DEBUG: '--debug'
};

export const CONTAINER_IMAGE_PULL_OPTIONS = {
    // container image pull [--scheme <scheme>] [--progress <type>] [--max-concurrent-downloads <max-concurrent-downloads>] [--arch <arch>] [--os <os>] [--platform <platform>] [--debug] <reference>
    // Scheme to use when connecting to the container registry. One of (http, https, auto) (default: auto)
    SCHEME: '--scheme',
    // Progress type (format: auto|none|ansi|plain|color) (default: auto)
    PROGRESS: '--progress',
    // Maximum number of concurrent downloads (default: 3) (default: 3)
    MAX_CONCURRENT_DOWNLOADS: '--max-concurrent-downloads',
    // Limit the pull to the specified architecture
    ARCH: '-a, --arch',
    // Limit the pull to the specified OS
    OS: '--os',
    // Limit the pull to the specified platform (format: os/arch[/variant], takes precedence over --os and --arch) [environment: CONTAINER_DEFAULT_PLATFORM]
    PLATFORM: '--platform',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_IMAGE_PUSH_OPTIONS = {
    // USAGE: container image push [--scheme <scheme>] [--progress <type>] [--arch <arch>] [--os <os>] [--platform <platform>] [--debug] <reference>
    // Scheme to use when connecting to the container registry. One of (http, https, auto) (default: auto)
    SCHEME: '--scheme',
    // Progress type (format: auto|none|ansi|plain|color) (default: auto)
    PROGRESS: '--progress',
    // Limit the push to the specified architecture
    ARCH: '-a, --arch',
    // Limit the push to the specified OS
    OS: '--os',
    // Limit the push to the specified platform (format: os/arch[/variant], takes precedence over --os and --arch) [environment: CONTAINER_DEFAULT_PLATFORM]
    PLATFORM: '--platform',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_IMAGE_SAVE_OPTIONS = {
    // USAGE: container image save [--arch <arch>] [--os <os>] [--output <output>] [--platform <platform>] [--debug] <references>
    // Limit the save to the specified architecture
    ARCH: '-a, --arch',
    // Limit the save to the specified OS
    OS: '--os',
    // Pathname for the saved image
    OUTPUT: '-o, --output',
    // Limit the save to the specified platform (format: os/arch[/variant], takes precedence over --os and --arch) [environment: CONTAINER_DEFAULT_PLATFORM]
    PLATFORM: '--platform',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_IMAGE_TAG_OPTIONS = {
    // USAGE: container image tag <source> <target> [--debug]
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;
