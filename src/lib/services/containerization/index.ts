export type { Result } from './types/result';
export type {
    Container,
    Image,
    ContainerId,
    ImageReference,
    DomainName,
    Port
} from './types/common';
export { createContainerId, createImageReference, createDomainName } from './types/common';
export type {
    ContainerSummary,
    ContainerState,
    ContainerInspection,
    CreateContainerOptions
} from './types/container';
export type {
    ImageSummary,
    ImageInspection,
    ImagePullOptions,
    ImagePullResponse
} from './types/image';

export {
    isSuccess,
    isFailure,
    map,
    flatMap,
    fold,
    pipe,
    getOrElse,
    withRetry
} from './types/result';

export {
    COMMANDS,
    CONTAINER_ACTIONS,
    IMAGE_ACTIONS,
    SYSTEM_ACTIONS,
    TIMEOUTS,
    CONTAINER_STATES,
    OUTPUT_FORMATS,
    formatJSON,
    getTimeout
} from './constants';

export {
    buildCommand,
    withArgs,
    withFlag,
    withTimeout,
    executeCommand,
    commandToString
} from './core/command';
export {
    validateCommandOutput,
    validateJSON,
    validateNonEmpty,
    isSuccessful,
    isJSON
} from './core/validation';
export { parseContainer, parseContainers, parseImage, parseImages } from './core/parsers';

export {
    listContainers,
    getAllContainers,
    getContainer,
    startContainer,
    stopContainer,
    removeContainer,
    getContainerLogs,
    createContainer,
    inspectContainer
} from './containers';

export {
    listImages,
    getAllImages,
    pullImage,
    removeImage,
    removeMultipleImages,
    inspectImage,
    importImageFromTar,
    exportImageToTar
} from './images';

export const containerization = {
    containers: {
        list: listContainers,
        get: getContainer,
        start: startContainer,
        stop: stopContainer,
        remove: removeContainer,
        logs: getContainerLogs,
        create: createContainer,
        inspect: inspectContainer
    },
    images: {
        list: listImages,
        pull: pullImage,
        remove: removeImage,
        inspect: inspectImage,
        import: importImageFromTar,
        export: exportImageToTar
    }
};
