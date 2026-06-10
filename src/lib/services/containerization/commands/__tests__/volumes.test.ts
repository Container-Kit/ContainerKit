/**
 * @fileoverview Tests for volume commands
 */

import { describe, it, expect } from 'vitest';
import {
	listVolumesCmd,
	createVolumeCmd,
	removeVolumeCmd,
	deleteVolumeCmd,
	inspectVolumeCmd,
	pruneVolumesCmd
} from '../volumes';

describe('Volume Commands', () => {
	describe('listVolumesCmd', () => {
		it('should default to JSON format', () => {
			const args = listVolumesCmd();
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});

		it('should include volume and ls subcommands', () => {
			const args = listVolumesCmd();
			expect(args).toContain('volume');
			expect(args).toContain('ls');
		});

		it('should accept table format', () => {
			const args = listVolumesCmd({ format: 'table' });
			expect(args).toContain('--format');
			expect(args).toContain('table');
		});

		it('should accept json format explicitly', () => {
			const args = listVolumesCmd({ format: 'json' });
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});
	});

	describe('createVolumeCmd', () => {
		it('should include volume name as positional argument', () => {
			const args = createVolumeCmd('my-volume');
			expect(args).toContain('my-volume');
		});

		it('should include volume and create subcommands', () => {
			const args = createVolumeCmd('my-volume');
			expect(args).toContain('volume');
			expect(args).toContain('create');
		});

		it('should work with various volume names', () => {
			const args = createVolumeCmd('postgres-data');
			expect(args).toContain('postgres-data');
		});

		it('should handle volume names with hyphens and underscores', () => {
			const args = createVolumeCmd('my_volume-123');
			expect(args).toContain('my_volume-123');
		});
	});

	describe('removeVolumeCmd', () => {
		it('should include volume name as positional argument', () => {
			const args = removeVolumeCmd(['my-volume']);
			expect(args).toContain('my-volume');
		});

		it('should include volume and rm subcommands', () => {
			const args = removeVolumeCmd(['my-volume']);
			expect(args).toContain('volume');
			expect(args).toContain('rm');
		});

		it('should handle multiple volumes', () => {
			const args = removeVolumeCmd(['vol1', 'vol2', 'vol3']);
			expect(args).toContain('vol1');
			expect(args).toContain('vol2');
			expect(args).toContain('vol3');
		});

		it('should work with readonly array', () => {
			const volumeNames: readonly string[] = ['vol1', 'vol2'] as const;
			const args = removeVolumeCmd(volumeNames);
			expect(args).toContain('vol1');
			expect(args).toContain('vol2');
		});

		it('should handle empty array', () => {
			const args = removeVolumeCmd([]);
			expect(args).toContain('volume');
			expect(args).toContain('rm');
		});
	});

	describe('deleteVolumeCmd', () => {
		it('should be alias for removeVolumeCmd', () => {
			const removeArgs = removeVolumeCmd(['my-volume']);
			const deleteArgs = deleteVolumeCmd(['my-volume']);
			expect(deleteArgs).toEqual(removeArgs);
		});

		it('should handle multiple volumes like removeVolumeCmd', () => {
			const removeArgs = removeVolumeCmd(['vol1', 'vol2', 'vol3']);
			const deleteArgs = deleteVolumeCmd(['vol1', 'vol2', 'vol3']);
			expect(deleteArgs).toEqual(removeArgs);
		});

		it('should work with readonly array like removeVolumeCmd', () => {
			const volumeNames: readonly string[] = ['vol1', 'vol2'] as const;
			const removeArgs = removeVolumeCmd(volumeNames);
			const deleteArgs = deleteVolumeCmd(volumeNames);
			expect(deleteArgs).toEqual(removeArgs);
		});
	});

	describe('inspectVolumeCmd', () => {
		it('should include volume name as positional argument', () => {
			const args = inspectVolumeCmd('my-volume');
			expect(args).toContain('my-volume');
		});

		it('should include volume and inspect subcommands', () => {
			const args = inspectVolumeCmd('my-volume');
			expect(args).toContain('volume');
			expect(args).toContain('inspect');
		});

		it('should work with various volume names', () => {
			const args = inspectVolumeCmd('postgres-data');
			expect(args).toContain('postgres-data');
		});
	});

	describe('pruneVolumesCmd', () => {
		it('should include volume and prune subcommands', () => {
			const args = pruneVolumesCmd();
			expect(args).toContain('volume');
			expect(args).toContain('prune');
		});

		it('should not include any positional arguments', () => {
			const args = pruneVolumesCmd();
			// Only subcommands should be present
			expect(args).toHaveLength(2);
			expect(args[0]).toBe('volume');
			expect(args[1]).toBe('prune');
		});
	});
});
