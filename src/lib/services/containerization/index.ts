/**
 * @fileoverview Main export for the Container CLI service
 * Re-exports all public types and functions
 */

// Type exports
export type { Either } from './types';
export {
    Left,
    Right,
    isLeft,
    isRight,
    mapRight,
    mapLeft,
    flatMap,
    fold,
    getOrElse,
    pipeEither,
    flatMapAsync,
    tryCatch,
    tryCatchAsync
} from './types';

// CLI exports
export type { CLIError, CLIOutput } from './cli';
export { executeCLI, validateCLIOutput, executeAndValidate } from './cli';

// Parser exports
export type { ParseError } from './parsers';
export {
    parseJSON,
    parseJSONArray,
    parseJSONObject,
    parseSpaceSeparated,
    parseCommaSeparated,
    parseLines,
    parseNonEmptyString
} from './parsers';

// Command exports - re-export everything from commands module
export * from './commands';

// Service exports
export type { ServiceError, Container, Image, Network } from './services';
export {
    listContainers,
    startContainer,
    stopContainer,
    removeContainers,
    inspectContainer,
    getContainerLogs,
    listImages,
    pullImage,
    removeImages,
    inspectImage,
    saveImage,
    loadImage,
    listNetworks,
    createNetwork,
    removeNetworks,
    inspectNetwork,
    getVersion,
    getStatus,
    listDNS,
    createDNS,
    removeDNS
} from './services';
