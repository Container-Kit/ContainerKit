/**
 * @fileoverview Tests for builder commands
 */

import { describe, it, expect } from 'vitest';
import {
	startBuilderCmd,
	stopBuilderCmd,
	builderStatusCmd,
	deleteBuilderCmd,
	removeBuilderCmd
} from '../builder';

describe('Builder Commands', () => {
	describe('startBuilderCmd', () => {
		it('should include builder and start subcommands', () => {
			const args = startBuilderCmd();
			expect(args).toContain('builder');
			expect(args).toContain('start');
		});

		it('should not include any options', () => {
			const args = startBuilderCmd();
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});

		it('should return only subcommands', () => {
			const args = startBuilderCmd();
			expect(args).toEqual(['builder', 'start']);
		});
	});

	describe('stopBuilderCmd', () => {
		it('should include builder and stop subcommands', () => {
			const args = stopBuilderCmd();
			expect(args).toContain('builder');
			expect(args).toContain('stop');
		});

		it('should not include any options', () => {
			const args = stopBuilderCmd();
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});

		it('should return only subcommands', () => {
			const args = stopBuilderCmd();
			expect(args).toEqual(['builder', 'stop']);
		});
	});

	describe('builderStatusCmd', () => {
		it('should include builder and status subcommands', () => {
			const args = builderStatusCmd();
			expect(args).toContain('builder');
			expect(args).toContain('status');
		});

		it('should not include any options', () => {
			const args = builderStatusCmd();
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});

		it('should return only subcommands', () => {
			const args = builderStatusCmd();
			expect(args).toEqual(['builder', 'status']);
		});
	});

	describe('deleteBuilderCmd', () => {
		it('should include builder and rm subcommands', () => {
			const args = deleteBuilderCmd();
			expect(args).toContain('builder');
			expect(args).toContain('rm');
		});

		it('should not include any options', () => {
			const args = deleteBuilderCmd();
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});

		it('should return only subcommands', () => {
			const args = deleteBuilderCmd();
			expect(args).toEqual(['builder', 'rm']);
		});
	});

	describe('removeBuilderCmd', () => {
		it('should be alias for deleteBuilderCmd', () => {
			const deleteArgs = deleteBuilderCmd();
			const removeArgs = removeBuilderCmd();
			expect(removeArgs).toEqual(deleteArgs);
		});

		it('should include builder and rm subcommands', () => {
			const args = removeBuilderCmd();
			expect(args).toContain('builder');
			expect(args).toContain('rm');
		});

		it('should not include any options', () => {
			const args = removeBuilderCmd();
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});

		it('should return only subcommands', () => {
			const args = removeBuilderCmd();
			expect(args).toEqual(['builder', 'rm']);
		});
	});
});
