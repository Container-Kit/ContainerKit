/**
 * @fileoverview Tests for system commands
 */

import { describe, it, expect } from 'vitest';
import {
	versionCmd,
	statusCmd,
	systemDfCmd,
	systemLogsCmd,
	systemStartCmd,
	systemStopCmd
} from '../system';

describe('System Commands', () => {
	describe('versionCmd', () => {
		it('should include system and version subcommands', () => {
			const args = versionCmd();
			expect(args).toContain('system');
			expect(args).toContain('version');
		});

		it('should not include any options', () => {
			const args = versionCmd();
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});

		it('should return only subcommands', () => {
			const args = versionCmd();
			expect(args).toEqual(['system', 'version']);
		});
	});

	describe('statusCmd', () => {
		it('should include system and status subcommands', () => {
			const args = statusCmd();
			expect(args).toContain('system');
			expect(args).toContain('status');
		});

		it('should not include any options', () => {
			const args = statusCmd();
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});

		it('should return only subcommands', () => {
			const args = statusCmd();
			expect(args).toEqual(['system', 'status']);
		});
	});

	describe('systemDfCmd', () => {
		it('should include system and df subcommands', () => {
			const args = systemDfCmd();
			expect(args).toContain('system');
			expect(args).toContain('df');
		});

		it('should not include --format when format is not provided', () => {
			const args = systemDfCmd();
			expect(args).not.toContain('--format');
		});

		it('should include --format when format is json', () => {
			const args = systemDfCmd({ format: 'json' });
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});

		it('should include --format when format is table', () => {
			const args = systemDfCmd({ format: 'table' });
			expect(args).toContain('--format');
			expect(args).toContain('table');
		});

		it('should accept custom format option', () => {
			const args = systemDfCmd({ format: 'json' });
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});
	});

	describe('systemLogsCmd', () => {
		it('should include system and logs subcommands', () => {
			const args = systemLogsCmd();
			expect(args).toContain('system');
			expect(args).toContain('logs');
		});

		it('should not include any options', () => {
			const args = systemLogsCmd();
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});

		it('should return only subcommands', () => {
			const args = systemLogsCmd();
			expect(args).toEqual(['system', 'logs']);
		});
	});

	describe('systemStartCmd', () => {
		it('should include system and start subcommands', () => {
			const args = systemStartCmd();
			expect(args).toContain('system');
			expect(args).toContain('start');
		});

		it('should not include any options', () => {
			const args = systemStartCmd();
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});

		it('should return only subcommands', () => {
			const args = systemStartCmd();
			expect(args).toEqual(['system', 'start']);
		});
	});

	describe('systemStopCmd', () => {
		it('should include system and stop subcommands', () => {
			const args = systemStopCmd();
			expect(args).toContain('system');
			expect(args).toContain('stop');
		});

		it('should not include any options', () => {
			const args = systemStopCmd();
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});

		it('should return only subcommands', () => {
			const args = systemStopCmd();
			expect(args).toEqual(['system', 'stop']);
		});
	});
});
