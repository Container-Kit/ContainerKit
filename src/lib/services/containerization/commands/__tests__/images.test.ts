/**
 * @fileoverview Tests for image commands
 */

import { describe, it, expect } from 'vitest';
import {
    listImagesCmd,
    pullImageCmd,
    pushImageCmd,
    removeImageCmd,
    deleteImageCmd,
    inspectImageCmd,
    saveImageCmd,
    loadImageCmd,
    tagImageCmd,
    buildImageCmd,
    pruneImagesCmd
} from '../images';

describe('Image Commands', () => {
    describe('listImagesCmd', () => {
        it('should default to JSON format', () => {
            const args = listImagesCmd();
            expect(args).toContain('--format');
            expect(args).toContain('json');
        });

        it('should include image and ls subcommands', () => {
            const args = listImagesCmd();
            expect(args).toContain('image');
            expect(args).toContain('ls');
        });

        it('should accept table format', () => {
            const args = listImagesCmd({ format: 'table' });
            expect(args).toContain('--format');
            expect(args).toContain('table');
        });

        it('should accept custom format option', () => {
            const args = listImagesCmd({ format: 'json' });
            expect(args).toContain('--format');
            expect(args).toContain('json');
        });
    });

    describe('pullImageCmd', () => {
        it('should include image ref as positional argument', () => {
            const args = pullImageCmd('alpine:latest');
            expect(args).toContain('alpine:latest');
        });

        it('should include image and pull subcommands', () => {
            const args = pullImageCmd('alpine:latest');
            expect(args).toContain('image');
            expect(args).toContain('pull');
        });

        it('should include --quiet flag when requested', () => {
            const args = pullImageCmd('alpine:latest', { quiet: true });
            expect(args).toContain('--quiet');
        });

        it('should include --quiet with false value when explicitly set to false', () => {
            const args = pullImageCmd('alpine:latest', { quiet: false });
            expect(args).toContain('--quiet');
            expect(args).toContain('false');
        });

        it('should work with full image references', () => {
            const args = pullImageCmd('registry.example.com/repo/image:1.0.0');
            expect(args).toContain('registry.example.com/repo/image:1.0.0');
        });
    });

    describe('pushImageCmd', () => {
        it('should include image ref as positional argument', () => {
            const args = pushImageCmd('myimage:latest');
            expect(args).toContain('myimage:latest');
        });

        it('should include image and push subcommands', () => {
            const args = pushImageCmd('myimage:latest');
            expect(args).toContain('image');
            expect(args).toContain('push');
        });

        it('should include --quiet flag when requested', () => {
            const args = pushImageCmd('myimage:latest', { quiet: true });
            expect(args).toContain('--quiet');
        });

        it('should include --quiet with false value when explicitly set to false', () => {
            const args = pushImageCmd('myimage:latest', { quiet: false });
            expect(args).toContain('--quiet');
            expect(args).toContain('false');
        });
    });

    describe('removeImageCmd', () => {
        it('should include all image refs', () => {
            const args = removeImageCmd(['image1:latest', 'image2:v1.0']);
            expect(args).toContain('image1:latest');
            expect(args).toContain('image2:v1.0');
        });

        it('should include image and rm subcommands', () => {
            const args = removeImageCmd(['image1:latest']);
            expect(args).toContain('image');
            expect(args).toContain('rm');
        });

        it('should include --force flag when force is true', () => {
            const args = removeImageCmd(['image1:latest'], true);
            expect(args).toContain('--force');
        });

        it('should include --force with false value when force is explicitly false', () => {
            const args = removeImageCmd(['image1:latest'], false);
            expect(args).toContain('--force');
            expect(args).toContain('false');
        });

        it('should handle multiple image refs', () => {
            const args = removeImageCmd(['img1', 'img2', 'img3']);
            expect(args).toContain('img1');
            expect(args).toContain('img2');
            expect(args).toContain('img3');
        });

        it('should work with readonly array', () => {
            const imageRefs: readonly string[] = ['image1', 'image2'] as const;
            const args = removeImageCmd(imageRefs);
            expect(args).toContain('image1');
            expect(args).toContain('image2');
        });
    });

    describe('deleteImageCmd', () => {
        it('should be alias for removeImageCmd', () => {
            const removeArgs = removeImageCmd(['image1:latest']);
            const deleteArgs = deleteImageCmd(['image1:latest']);
            expect(deleteArgs).toEqual(removeArgs);
        });

        it('should include --force flag when requested', () => {
            const removeArgs = removeImageCmd(['image1:latest'], true);
            const deleteArgs = deleteImageCmd(['image1:latest'], true);
            expect(deleteArgs).toEqual(removeArgs);
        });

        it('should handle multiple images like removeImageCmd', () => {
            const removeArgs = removeImageCmd(['img1', 'img2', 'img3'], false);
            const deleteArgs = deleteImageCmd(['img1', 'img2', 'img3'], false);
            expect(deleteArgs).toEqual(removeArgs);
        });
    });

    describe('inspectImageCmd', () => {
        it('should include image ref', () => {
            const args = inspectImageCmd('alpine:latest');
            expect(args).toContain('alpine:latest');
        });

        it('should include image and inspect subcommands', () => {
            const args = inspectImageCmd('alpine:latest');
            expect(args).toContain('image');
            expect(args).toContain('inspect');
        });

        it('should work with full image reference', () => {
            const args = inspectImageCmd('registry.example.com/repo/image:1.0.0');
            expect(args).toContain('registry.example.com/repo/image:1.0.0');
        });
    });

    describe('saveImageCmd', () => {
        it('should include output path option', () => {
            const args = saveImageCmd('alpine:latest', '/path/to/image.tar');
            expect(args).toContain('--output');
            expect(args).toContain('/path/to/image.tar');
        });

        it('should include image ref', () => {
            const args = saveImageCmd('alpine:latest', '/path/to/image.tar');
            expect(args).toContain('alpine:latest');
        });

        it('should include image and save subcommands', () => {
            const args = saveImageCmd('alpine:latest', '/path/to/image.tar');
            expect(args).toContain('image');
            expect(args).toContain('save');
        });

        it('should handle various output paths', () => {
            const args = saveImageCmd('myimage:v1', './exports/image.tar');
            expect(args).toContain('./exports/image.tar');
        });
    });

    describe('loadImageCmd', () => {
        it('should include input path option', () => {
            const args = loadImageCmd('/path/to/image.tar');
            expect(args).toContain('--input');
            expect(args).toContain('/path/to/image.tar');
        });

        it('should include image and load subcommands', () => {
            const args = loadImageCmd('/path/to/image.tar');
            expect(args).toContain('image');
            expect(args).toContain('load');
        });

        it('should handle various input paths', () => {
            const args = loadImageCmd('./exports/image.tar');
            expect(args).toContain('./exports/image.tar');
        });
    });

    describe('tagImageCmd', () => {
        it('should include source and target refs', () => {
            const args = tagImageCmd('alpine:latest', 'myregistry/alpine:latest');
            expect(args).toContain('alpine:latest');
            expect(args).toContain('myregistry/alpine:latest');
        });

        it('should include image and tag subcommands', () => {
            const args = tagImageCmd('alpine:latest', 'myregistry/alpine:latest');
            expect(args).toContain('image');
            expect(args).toContain('tag');
        });

        it('should maintain order of source then target', () => {
            const args = tagImageCmd('source:latest', 'target:latest');
            const sourceIdx = args.indexOf('source:latest');
            const targetIdx = args.indexOf('target:latest');
            expect(sourceIdx).toBeLessThan(targetIdx);
        });
    });

    describe('buildImageCmd', () => {
        it('should include dockerfile and context path', () => {
            const args = buildImageCmd('/path/to/Dockerfile', '/path/to/context');
            expect(args).toContain('/path/to/Dockerfile');
            expect(args).toContain('/path/to/context');
        });

        it('should include -f flag for dockerfile', () => {
            const args = buildImageCmd('/path/to/Dockerfile', '/path/to/context');
            expect(args).toContain('-f');
        });

        it('should include image and build subcommands', () => {
            const args = buildImageCmd('/path/to/Dockerfile', '/path/to/context');
            expect(args).toContain('image');
            expect(args).toContain('build');
        });

        it('should include --tag when provided', () => {
            const args = buildImageCmd('/path/to/Dockerfile', '/path/to/context', {
                tag: 'myimage:v1.0'
            });
            expect(args).toContain('--tag');
            expect(args).toContain('myimage:v1.0');
        });

        it('should not include --tag when not provided', () => {
            const args = buildImageCmd('/path/to/Dockerfile', '/path/to/context');
            expect(args).not.toContain('--tag');
        });

        it('should maintain -f dockerfile context order', () => {
            const args = buildImageCmd('/path/to/Dockerfile', '/path/to/context');
            const fIdx = args.indexOf('-f');
            const dockerfileIdx = args.indexOf('/path/to/Dockerfile');
            const contextIdx = args.indexOf('/path/to/context');
            expect(fIdx).toBeLessThan(dockerfileIdx);
            expect(dockerfileIdx).toBeLessThan(contextIdx);
        });
    });

    describe('pruneImagesCmd', () => {
        it('should include image and prune subcommands', () => {
            const args = pruneImagesCmd();
            expect(args).toContain('image');
            expect(args).toContain('prune');
        });

        it('should include --all flag when all is true', () => {
            const args = pruneImagesCmd(true);
            expect(args).toContain('--all');
        });

        it('should include --all with false value when all is explicitly false', () => {
            const args = pruneImagesCmd(false);
            expect(args).toContain('--all');
            expect(args).toContain('false');
        });

        it('should not include --all flag when all is undefined', () => {
            const args = pruneImagesCmd();
            expect(args).not.toContain('--all');
        });
    });
});
