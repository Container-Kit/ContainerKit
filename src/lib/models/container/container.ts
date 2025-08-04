import type { ContainerImage } from '$lib/models/container/image';

export type ContainerClient = {
    configuration: ContainerConfiguration;
    networks: NetworkAttachment[]; // This seems to be a duplicate or distinct from configuration.networks
    status: 'running' | 'stopped';
};

export type ContainerConfiguration = {
    hostname: string;
    dns: ContainerDNS;
    resources: ContainerResources;
    image: ContainerImage;
    sysctls: Record<string, never>; // Or a more specific type if sysctls can have properties
    platform: ContainerPlatform;
    rosetta: boolean;
    networks: string[];
    labels: Record<string, never>; // Or a more specific type if labels can have properties
    id: string;
    mounts: string[]; // Or a more specific type if mounts can have properties
    runtimeHandler: string;
    initProcess: ContainerInitProcess;
};

export type ContainerInitProcess = {
    rlimits: string[]; // Or a more specific type if rlimits can have properties
    supplementalGroups: string[];
    arguments: string[];
    user: {
        id: {
            uid: number;
            gid: number;
        };
    };
    executable: string;
    workingDirectory: string;
    terminal: boolean;
    environment: string[];
};

export type ContainerPlatform = {
    os: string;
    architecture: string;
};

export type ContainerResources = {
    cpus: number;
    memoryInBytes: number;
};

export type ContainerDNS = {
    searchDomains: string[];
    options: string[];
    domain: string;
    nameservers: string[];
};

export type NetworkAttachment = {
     network: string
    /// The hostname associated with the attachment.
    hostname: string
    /// The subnet CIDR, where the address is the container interface IPv4 address.
    address: string
    /// The IPv4 gateway address.
    gateway: string
}
