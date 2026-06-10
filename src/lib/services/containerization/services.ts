/**
 * @fileoverview Pure functional container services
 * High-level operations built from lower-level functions
 */

import type { Either, flatMap, mapRight, isRight } from './types';
import { executeAndValidate, type CLIError, type CLIOutput } from './cli';
import { parseJSONArray, parseJSONObject, parseLines, parseNonEmptyString } from './parsers';
import {
    listContainersCmd,
    startContainerCmd,
    stopContainerCmd,
    removeContainerCmd,
    inspectContainerCmd,
    logsContainerCmd,
    listImagesCmd,
    pullImageCmd,
    removeImageCmd,
    inspectImageCmd,
    saveImageCmd,
    loadImageCmd,
    listNetworksCmd,
    createNetworkCmd,
    removeNetworkCmd,
    inspectNetworkCmd,
    versionCmd,
    statusCmd,
    listDNSCmd,
    createDNSCmd,
    removeDNSCmd
} from './commands';

/**
 * Generic error type for services
 */
export type ServiceError = CLIError | { type: 'ParseError'; message: string };

/**
 * Container data structure
 */
export type Container = {
    readonly id: string;
    readonly name: string;
    readonly state: string;
    readonly image: string;
    readonly [key: string]: any;
};

/**
 * Image data structure
 */
export type Image = {
    readonly id: string;
    readonly name?: string;
    readonly [key: string]: any;
};

/**
 * Network data structure
 */
export type Network = {
    readonly name: string;
    readonly [key: string]: any;
};

// ============================================================================
// Container Services
// ============================================================================

/**
 * List all containers
 */
export const listContainers = async (
    all: boolean = false
): Promise<Either<ServiceError, Container[]>> => {
    const args = listContainersCmd({ all });
    const result = await executeAndValidate(args);

    return flatMap((output: CLIOutput) =>
        mapRight((containers: Container[]) => containers)(parseJSONArray<Container>(output.stdout))
    )(result);
};

/**
 * Start a container
 */
export const startContainer = async (
    containerId: string
): Promise<Either<ServiceError, string>> => {
    const args = startContainerCmd(containerId);
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

/**
 * Stop a container
 */
export const stopContainer = async (containerId: string): Promise<Either<ServiceError, string>> => {
    const args = stopContainerCmd(containerId);
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

/**
 * Remove containers
 */
export const removeContainers = async (
    containerIds: readonly string[],
    force: boolean = false
): Promise<Either<ServiceError, string>> => {
    const args = removeContainerCmd(containerIds, force);
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

/**
 * Inspect a container
 */
export const inspectContainer = async (
    containerId: string
): Promise<Either<ServiceError, Record<string, any>>> => {
    const args = inspectContainerCmd(containerId);
    const result = await executeAndValidate(args);

    return flatMap((output: CLIOutput) => parseJSONArray<Record<string, any>>(output.stdout))(
        result
    );
};

/**
 * Get container logs
 */
export const getContainerLogs = async (
    containerId: string,
    options: { follow?: boolean; tail?: number } = {}
): Promise<Either<ServiceError, string>> => {
    const args = logsContainerCmd(containerId, options);
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

// ============================================================================
// Image Services
// ============================================================================

/**
 * List all images
 */
export const listImages = async (): Promise<Either<ServiceError, Image[]>> => {
    const args = listImagesCmd();
    const result = await executeAndValidate(args);

    return flatMap((output: CLIOutput) => parseJSONArray<Image>(output.stdout))(result);
};

/**
 * Pull an image
 */
export const pullImage = async (
    imageRef: string,
    quiet: boolean = false
): Promise<Either<ServiceError, string>> => {
    const args = pullImageCmd(imageRef, { quiet });
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

/**
 * Remove images
 */
export const removeImages = async (
    imageRefs: readonly string[],
    force: boolean = false
): Promise<Either<ServiceError, string>> => {
    const args = removeImageCmd(imageRefs, force);
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

/**
 * Inspect an image
 */
export const inspectImage = async (
    imageRef: string
): Promise<Either<ServiceError, Record<string, any>>> => {
    const args = inspectImageCmd(imageRef);
    const result = await executeAndValidate(args);

    return flatMap((output: CLIOutput) => parseJSONArray<Record<string, any>>(output.stdout))(
        result
    );
};

/**
 * Save image to tar file
 */
export const saveImage = async (
    imageRef: string,
    outputPath: string
): Promise<Either<ServiceError, string>> => {
    const args = saveImageCmd(imageRef, outputPath);
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

/**
 * Load image from tar file
 */
export const loadImage = async (inputPath: string): Promise<Either<ServiceError, string>> => {
    const args = loadImageCmd(inputPath);
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

// ============================================================================
// Network Services
// ============================================================================

/**
 * List all networks
 */
export const listNetworks = async (): Promise<Either<ServiceError, Network[]>> => {
    const args = listNetworksCmd();
    const result = await executeAndValidate(args);

    return flatMap((output: CLIOutput) => parseJSONArray<Network>(output.stdout))(result);
};

/**
 * Create a network
 */
export const createNetwork = async (networkName: string): Promise<Either<ServiceError, string>> => {
    const args = createNetworkCmd(networkName);
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

/**
 * Remove networks
 */
export const removeNetworks = async (
    networkNames: readonly string[]
): Promise<Either<ServiceError, string>> => {
    const args = removeNetworkCmd(networkNames);
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

/**
 * Inspect a network
 */
export const inspectNetwork = async (
    networkName: string
): Promise<Either<ServiceError, Record<string, any>>> => {
    const args = inspectNetworkCmd(networkName);
    const result = await executeAndValidate(args);

    return flatMap((output: CLIOutput) => parseJSONArray<Record<string, any>>(output.stdout))(
        result
    );
};

// ============================================================================
// System Services
// ============================================================================

/**
 * Get system version
 */
export const getVersion = async (): Promise<Either<ServiceError, string>> => {
    const args = versionCmd();
    const result = await executeAndValidate(args);

    return flatMap((output: CLIOutput) => parseNonEmptyString(output.stdout))(result);
};

/**
 * Get system status
 */
export const getStatus = async (): Promise<Either<ServiceError, string>> => {
    const args = statusCmd();
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

// ============================================================================
// DNS Services
// ============================================================================

/**
 * List DNS entries
 */
export const listDNS = async (): Promise<Either<ServiceError, string[]>> => {
    const args = listDNSCmd();
    const result = await executeAndValidate(args);

    return flatMap((output: CLIOutput) => parseLines(output.stdout))(result);
};

/**
 * Create DNS entry
 */
export const createDNS = async (domain: string): Promise<Either<ServiceError, string>> => {
    const args = createDNSCmd(domain);
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};

/**
 * Remove DNS entry
 */
export const removeDNS = async (domain: string): Promise<Either<ServiceError, string>> => {
    const args = removeDNSCmd(domain);
    const result = await executeAndValidate(args);

    return mapRight((output: CLIOutput) => output.stdout)(result);
};
