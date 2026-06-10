/**
 * @fileoverview Tests for common command builders
 */

import { describe, it, expect } from 'vitest';
import { buildArgs } from '../common';

describe('Common Commands', () => {
	describe('buildArgs', () => {
		it('should build basic command args', () => {
			const args = buildArgs(['container', 'list'], {}, []);
			expect(args).toEqual(['container', 'list']);
		});

		it('should add boolean flags', () => {
			const args = buildArgs(['list'], { '--all': true }, []);
			expect(args).toContain('--all');
		});

		it('should skip undefined options', () => {
			const args = buildArgs(['list'], { '--all': undefined }, []);
			expect(args).not.toContain('--all');
		});

		it('should add string values after flags', () => {
			const args = buildArgs(['list'], { '--format': 'json' }, []);
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});

		it('should add positional arguments', () => {
			const args = buildArgs(['start'], {}, ['container-id']);
			expect(args).toContain('container-id');
		});

		it('should build complete command', () => {
			const args = buildArgs(['list'], { '--all': true, '--format': 'json' }, []);
			expect(args).toEqual(['list', '--all', '--format', 'json']);
		});
	});
});
