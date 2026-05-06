import { DEBUG_FLAG, OUTPUT_FORMAT_FLAG } from './common';

export const CONTAINER_SUBCOMMANDS = {
    // Create a new container
    CREATE: 'create',
    // Delete one or more containers
    DELETE: 'delete',
    // Delete one or more containers
    REMOVE: 'rm',
    // Run a new command in a running container
    EXECUTE: 'exec',
    // Export a container's filesystem as a tar archive
    EXPORT: 'export',
    // Display information about one or more containers
    INSPECT: 'inspect',
    // Kill or signal one or more running containers
    KILL: 'kill',
    // List running containers
    LIST: 'list',
    // List running containers
    LS: 'ls',
    // Fetch container logs
    LOGS: 'logs',
    // Run a container
    RUN: 'run',
    // Start a container
    START: 'start',
    // Display resource usage statistics for containers
    STATS: 'stats',
    // Stop one or more running containers
    STOP: 'stop',
    // Remove all stopped containers
    PRUNE: 'prune',
    // Build an image from a Dockerfile or Containerfile
    BUILD: 'build',
    // Manage images
    IMAGE: 'image',
    // Manage registry logins
    REGISTRY: 'registry',
    // Manage container volumes
    VOLUME: 'volume',
    // Manage an image builder instance
    BUILDER: 'builder',
    // Manage container networks
    NETWORK: 'network',
    // Manage system components
    SYSTEM: 'system'
};

export const CONTAINER_SUBCOMMAND_CREATE = {
    // USAGE: container create [<options>] <image> [<arguments> ...]
    // Process options
    // Set environment variables (key=value, or just key to inherit from host)
    ENV: '--env',
    // Read in a file of environment variables (key=value format, ignores # comments and blank lines)
    ENV_FILE: '--env-file',
    // Set the group ID for the process
    GID: '--gid',
    // Keep the standard input open even if not attached
    INTERACTIVE: '--interactive',
    // Open a TTY with the process
    TTY: '--tty',
    // User options
    // Set the user for the process (format: name|uid[:gid])
    USER: '--user',
    // Set the user ID for the process
    UID: '--uid',
    // Set the initial working directory inside the container
    WORKDIR: '--workdir',
    // Alternate flag for setting the initial working directory inside the container
    CWD: '--cwd',
    // Set resource limits (format: <type>=<soft>[:<hard>])
    ULIMIT: '--ulimit',
    // Resource options
    // Number of CPUs to allocate to the container
    CPUS: '--cpus',
    // Amount of memory (1MiByte granularity), with optional K, M, G, T, or P suffix
    MEMORY: '--memory',
    // Management options
    // Set arch if image can target multiple architectures (default: arm64)
    ARCH: '--arch',
    // Add a Linux capability (e.g. CAP_NET_RAW, or ALL)
    CAP_ADD: '--cap-add',
    // Drop a Linux capability (e.g. CAP_NET_RAW, or ALL)
    CAP_DROP: '--cap-drop',
    // Write the container ID to the path provided
    CIDFILE: '--cidfile',
    // Run the container and detach from the process
    DETACH: '--detach',
    // Set the DNS servers for the containerdns'
    DNS: '--dns',
    // Default DNS domain for the container
    DNS_DOMAIN: '--dns-domain',
    // DNS options
    DNS_OPTION: '--dns-option',
    // DNS search domains for the container
    DNS_SEARCH: '--dns-search',
    // Override the entrypoint of the image
    ENTRYPOINT: '--entrypoint',
    // Run an init process inside the container that forwards signals and reaps processes
    INIT: '--init',
    // Use a custom init image instead of the default
    INIT_IMAGE: '--init-image',
    // Set a custom kernel path
    KERNEL: '--kernel',
    // Add a key=value label to the container
    LABEL: '--label',
    // Add a mount to the container (format: type=<>,source=<>,target=<>,readonly)
    MOUNT: '--mount',
    // Use the specified name as the container ID
    NAME: '--name',
    // Attach the container to a network (format: <name>[,mac=XX:XX:XX:XX:XX:XX][,mtu=VALUE])
    NETWORK: '--network',
    // Do not configure DNS in the container
    NO_DNS: '--no-dns',
    // Set OS if image can target multiple operating systems (default: linux)
    OS: '--os',
    // Publish a port from container to host (format: [host-ip:]host-port:container-port[/protocol])
    PUBLISH: '--publish',
    // Platform for the image if it's multi-platform. This takes precedence over --os and --arch [environment: CONTAINER_DEFAULT_PLATFORM]
    PLATFORM: '--platform',
    // Note: This is a custom option for our container runtime to specify socket bindings, not a standard Docker CLI option
    PUBLISH_SOCKET: '--publish-socket',
    // Mount the container's root filesystem as read-only
    READ_ONLY: '--read-only',
    // Remove the container after it stops
    REMOVE: '--remove',
    // Alternate flag for removing the container after it stops
    RM: '--remove',
    // Enable Rosetta in the container
    ROSETTA: '--rosetta',
    // Set the runtime handler for the container (default: container-runtime-linux)
    RUNTIME: '--runtime',
    // Forward SSH agent socket to container
    SSH: '--ssh',
    // Add a tmpfs mount to the container at the given path
    TMPFS: '--tmpfs',
    // Expose virtualization capabilities to the container (requires host and guest support)
    VIRTUALIZATION: '--virtualization',
    // Bind mount a volume into the container
    VOLUME: '--volume',
    // Registry options
    // Scheme to use when connecting to the container registry. One of (http, https, auto) (default: auto)
    SCHEME: '--scheme',
    // Image fetch options
    // Maximum number of concurrent downloads (default: 3)
    MAX_CONCURRENT_DOWNLOADS: '--max-concurrent-downloads',
    // Options
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SUBCOMMAND_DELETE = {
    //  USAGE: container delete [--all] [--force] [--debug] [<container-ids> ...]
    // Delete all containers
    ALL: '--all',
    // Delete containers even if they are running
    FORCE: '--force',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SUBCOMMAND_EXECUTE = {
    // USAGE: container exec [<options>] <container-id> <arguments> ...
    // Process options
    // Set environment variables (key=value, or just key to inherit from host)
    ENV: '--env',
    // Read in a file of environment variables (key=value format, ignores # comments and blank lines)
    ENV_FILE: '--env-file',
    // Set the group ID for the process
    GID: '--gid',
    // Keep the standard input open even if not attached
    INTERACTIVE: '--interactive',
    // Open a TTY with the process
    TTY: '--tty',
    // Set the user for the process (format: name|uid[:gid])
    USER: '--user',
    // Set the user ID for the process
    UID: '--uid',
    // Set the initial working directory inside the container
    WORKDIR: '--workdir',
    // Alternate flag for setting the initial working directory inside the container
    CWD: '--cwd',
    // Set resource limits (format: <type>=<soft>[:<hard>])
    ULIMIT: '--ulimit',
    // Options
    // Run the process and detach from it
    DETACH: '--detach',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SUBCOMMAND_EXPORT = {
    // USAGE: container export [--debug] [--output <output>] <id>
    // Pathname for the saved container filesystem (defaults to stdout)
    OUTPUT: '--output',
    // Alternate flag for output pathname
    O: '-o',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SUBCOMMAND_INSPECT = {
    // USAGE: container inspect [--debug] <container-ids> ...
    // Container IDs to inspect
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SUBCOMMAND_KILL = {
    // USAGE: container kill [--all] [--signal <signal>] [--debug] [<container-ids> ...]
    // Kill or signal all running containers
    ALL: '--all',
    // Signal to send to the container(s) (default: KILL)
    SIGNAL: '--signal',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SUBCOMMAND_LIST = {
    // USAGE: container list [--all] [--format <format>] [--quiet] [--debug]
    // Include containers that are not running
    ALL: '--all',
    // Format of the output (values: json, table, yaml; default: table)
    FORMAT: '--format',
    // Enable debug output [environment: CONTAINER_DEBUG]
    DEBUG: '--debug'
};

export const CONTAINER_SUBCOMMAND_LOGS = {
    // USAGE: container logs [--debug] <container-id>
    // Container ID to fetch logs for
    CONTAINER_ID: '<container-id>',
    // Enable debug output [environment: CONTAINER_DEBUG]
    DEBUG: '--debug'
};

export const CONTAINER_SUBCOMMAND_RUN = {
    // USAGE: container run [<options>] <image> [<arguments> ...]
    // Process options
    // Set environment variables (key=value, or just key to inherit from host)
    ENV: '--env',
    // Read in a file of environment variables (key=value format, ignores # comments and blank lines)
    ENV_FILE: '--env-file',
    // Set the group ID for the process
    GID: '--gid',
    // Keep the standard input open even if not attached
    INTERACTIVE: '--interactive',
    // Open a TTY with the process
    TTY: '--tty',
    // User options
    // Set the user for the process (format: name|uid[:gid])
    USER: '--user',
    // Set the user ID for the process
    UID: '--uid',
    // Set the initial working directory inside the container
    WORKDIR: '--workdir',
    // Alternate flag for setting the initial working directory inside the container
    CWD: '--cwd',
    // Set resource limits (format: <type>=<soft>[:<hard>])
    ULIMIT: '--ulimit',
    // Resource options
    // Number of CPUs to allocate to the container
    CPUS: '--cpus',
    // Amount of memory (1MiByte granularity), with optional K, M, G, T, or P suffix
    MEMORY: '--memory',
    // Management options
    // Set arch if image can target multiple architectures (default: arm64)
    ARCH: '--arch',
    // Add a Linux capability (e.g. CAP_NET_RAW, or ALL)
    CAP_ADD: '--cap-add',
    // Drop a Linux capability (e.g. CAP_NET_RAW, or ALL)
    CAP_DROP: '--cap-drop',
    // Write the container ID to the path provided
    CIDFILE: '--cidfile',
    // Run the container and detach from the process
    DETACH: '--detach',
    // Set the DNS servers for the containerdns'
    DNS: '--dns',
    // Default DNS domain for the container
    DNS_DOMAIN: '--dns-domain',
    // DNS options
    DNS_OPTION: '--dns-option',
    // DNS search domains for the container
    DNS_SEARCH: '--dns-search',
    // Override the entrypoint of the image
    ENTRYPOINT: '--entrypoint',
    // Run an init process inside the container that forwards signals and reaps processes
    INIT: '--init',
    // Use a custom init image instead of the default
    INIT_IMAGE: '--init-image',
    // Set a custom kernel path
    KERNEL: '--kernel',
    // Add a key=value label to the container
    LABEL: '--label',
    // Add a mount to the container (format: type=<>,source=<>,target=<>,readonly)
    MOUNT: '--mount',
    // Use the specified name as the container ID
    NAME: '--name',
    // Attach the container to a network (format: <name>[,mac=XX:XX:XX:XX:XX:XX][,mtu=VALUE])
    NETWORK: '--network',
    // Do not configure DNS in the container
    NO_DNS: '--no-dns',
    // Set OS if image can target multiple operating systems (default: linux)
    OS: '--os',
    // Publish a port from container to host (format: [host-ip:]host-port:container-port[/protocol])
    PUBLISH: '--publish',
    // Platform for the image if it's multi-platform. This takes precedence over --os and --arch [environment: CONTAINER_DEFAULT_PLATFORM]
    PLATFORM: '--platform',
    // Note: This is a custom option for our container runtime to specify socket bindings, not a standard Docker CLI option
    PUBLISH_SOCKET: '--publish-socket',
    // Mount the container's root filesystem as read-only
    READ_ONLY: '--read-only',
    // Remove the container after it stops
    REMOVE: '--remove',
    // Alternate flag for removing the container after it stops
    RM: '--remove',
    // Enable Rosetta in the container
    ROSETTA: '--rosetta',
    // Set the runtime handler for the container (default: container-runtime-linux)
    RUNTIME: '--runtime',
    // Forward SSH agent socket to container
    SSH: '--ssh',
    // Add a tmpfs mount to the container at the given path
    TMPFS: '--tmpfs',
    // Expose virtualization capabilities to the container (requires host and guest support)
    VIRTUALIZATION: '--virtualization',
    // Bind mount a volume into the container
    VOLUME: '--volume',
    // Registry options
    // Scheme to use when connecting to the container registry. One of (http, https, auto) (default: auto)
    SCHEME: '--scheme',
    // Image fetch options
    // Maximum number of concurrent downloads (default: 3)
    MAX_CONCURRENT_DOWNLOADS: '--max-concurrent-downloads',
    // Options
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SUBCOMMAND_START = {
    // USAGE: container start [--attach] [--interactive] [--debug] <container-id>
    // Attach stdout/stderr
    ATTACH: '--attach',
    // Attach stdin
    INTERACTIVE: '--interactive',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SUBCOMMAND_STATS = {
    //  USAGE: container stats [<containers> ...] [--format <format>] [--no-stream] [--debug]
    // Format of the output (values: json, table, yaml; default: table)
    OUTPUT_FORMAT_FLAG,
    // Disable streaming stats and only pull the first result
    NO_STREAM: '--no-stream',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SUBCOMMAND_STOP = {
    // USAGE: container stop [--all] [--signal <signal>] [--time <time>] [--debug] [<container-ids> ...]
    // Stop all running containers
    ALL: '--all',
    // Signal to send to the containers (default: SIGTERM)
    SIGNAL: '--signal',
    // Seconds to wait before killing the containers (default: 5)
    TIME: '--time',
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_SUBCOMMAND_PRUNE = {
    // container prune [--debug]
    // Enable debug output [environment: CONTAINER_DEBUG]
    ...DEBUG_FLAG
} as const;

export const CONTAINER_BUILD_OPTIONS = {
    // USAGE: container build [<options>] [<context-dir>]
    // Add the architecture type to the build
    ARCH: '--arch',
    // Set build-time variables
    BUILD_ARG: '--build-arg',
    // Number of CPUs to allocate to the builder container
    CPUS: '--cpus',
    // Path to Dockerfile
    FILE: '--file',
    // Set a label
    LABEL: '--label',
    // Amount of builder container memory (1MiByte granularity), with optional K, M, G, T, or P suffix
    MEMORY: '--memory',
    // Do not use cache
    NO_CACHE: '--no-cache',
    // Output configuration for the build (format: type=<oci|tar|local>[,dest=]) (default: type=oci)
    OUTPUT: '--output',
    // Add the OS type to the build
    OS: '--os',
    // Add the platform to the build (format: os/arch[/variant], takes precedence over --os and --arch) [environment: CONTAINER_DEFAULT_PLATFORM]
    PLATFORM: '--platform',
    // Progress type (format: auto|plain|tty) (default: auto)
    PROGRESS: '--progress',
    // Suppress build output
    QUIET: '--quiet',
    // Set build-time secrets (format: id=<key>[,env=<ENV_VAR>|,src=<local/path>])
    SECRET: '--secret',
    // Name for the built image (default: 123ee03d-c52f-42b4-8134-e80f74fa9162)
    TAG: '--tag',
    // Set the target build stage
    TARGET: '--target',
    // Builder shim vsock port (default: 8088)
    VSOCK_PORT: '--vsock-port',
    // Enable debug output [environment: CONTAINER_DEBUG]
    DEBUG: '--debug',
    // DNS nameserver IP address --dns <ip>
    DNS: '--dns',
    // Default DNS domain
    DNS_DOMAIN: '--dns-domain',
    // DNS Options
    DNS_OPTION: '--dns-option',
    // DNS search domains
    DNS_SEARCH: '--dns-search',
    // Pull latest image
    PULL: '--pull'
} as const;
