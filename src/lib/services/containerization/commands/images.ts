/**
 * @fileoverview Image command builders
 */

import { buildArgs } from './common';

/**
 * Image list command
 */
export const listImagesCmd = (options: { format?: 'json' | 'table' } = {}): readonly string[] =>
	buildArgs(['image', 'ls'], { '--format': options.format || 'json' }, []);

/**
 * Image pull command
 */
export const pullImageCmd = (
	imageRef: string,
	options: { quiet?: boolean } = {}
): readonly string[] => buildArgs(['image', 'pull'], { '--quiet': options.quiet }, [imageRef]);

/**
 * Image push command
 */
export const pushImageCmd = (
	imageRef: string,
	options: { quiet?: boolean } = {}
): readonly string[] => buildArgs(['image', 'push'], { '--quiet': options.quiet }, [imageRef]);

/**
 * Image remove command
 */
export const removeImageCmd = (
	imageRefs: readonly string[],
	force: boolean = false
): readonly string[] => buildArgs(['image', 'rm'], { '--force': force }, Array.from(imageRefs));

/**
 * Image delete command (alias for rm)
 */
export const deleteImageCmd = (
	imageRefs: readonly string[],
	force: boolean = false
): readonly string[] => removeImageCmd(imageRefs, force);

/**
 * Image inspect command
 */
export const inspectImageCmd = (imageRef: string): readonly string[] =>
	buildArgs(['image', 'inspect'], {}, [imageRef]);

/**
 * Image save command
 */
export const saveImageCmd = (imageRef: string, outputPath: string): readonly string[] =>
	buildArgs(['image', 'save'], { '--output': outputPath }, [imageRef]);

/**
 * Image load command
 */
export const loadImageCmd = (inputPath: string): readonly string[] =>
	buildArgs(['image', 'load'], { '--input': inputPath }, []);

/**
 * Image tag command
 */
export const tagImageCmd = (sourceRef: string, targetRef: string): readonly string[] =>
	buildArgs(['image', 'tag'], {}, [sourceRef, targetRef]);

/**
 * Image build command
 */
export const buildImageCmd = (
	dockerfile: string,
	contextPath: string,
	options: { tag?: string } = {}
): readonly string[] => {
	const opts: Record<string, string | undefined> = {};
	if (options.tag) opts['--tag'] = options.tag;
	return buildArgs(['image', 'build'], opts, ['-f', dockerfile, contextPath]);
};

/**
 * Image prune command
 */
export const pruneImagesCmd = (all?: boolean): readonly string[] =>
	buildArgs(['image', 'prune'], { '--all': all }, []);
