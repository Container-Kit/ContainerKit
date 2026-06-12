import { z } from 'zod';
import { parseJson, run, type Result } from './cli';
import { ContainerImageSchema, type ContainerImage } from '$lib/models/container';

const ImageListSchema = z.array(ContainerImageSchema);

export async function getAllImages(): Promise<Result<ContainerImage[]>> {
    const output = await run(['image', 'list', '--format', 'json']);
    if (!output.ok) return output;
    // empty stdout means no images, not an error
    return parseJson(output.data.trim() || '[]', ImageListSchema);
}

export function pullImage(imageDetails: string[]): Promise<Result<string>> {
    return run(['image', 'pull', ...imageDetails]);
}

export function removeImage(imageReference: string): Promise<Result<string>> {
    return removeMultipleImages([imageReference]);
}

export function removeMultipleImages(imagesReference: string[]): Promise<Result<string>> {
    return run(['image', 'delete', ...imagesReference]);
}

export async function inspectImage(imageReference: string): Promise<Result<unknown>> {
    const output = await run(['image', 'inspect', imageReference]);
    if (!output.ok) return output;
    return parseJson(output.data, z.unknown());
}

export function importImageFromTar(path: string): Promise<Result<string>> {
    return run(['image', 'load', '--input', path]);
}

export function exportImageToTar(
    imageReference: string,
    outputPath: string,
    additionalOptions: string[] = []
): Promise<Result<string>> {
    return run(['image', 'save', ...additionalOptions, '--output', outputPath, imageReference]);
}
