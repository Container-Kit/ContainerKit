/**
 * @fileoverview Tests for registry commands
 */

import { describe, it, expect } from 'vitest';
import {
	listRegistriesCmd,
	registryLoginCmd,
	registryLogoutCmd
} from '../registries';

describe('Registry Commands', () => {
	describe('listRegistriesCmd', () => {
		it('should default to JSON format', () => {
			const args = listRegistriesCmd();
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});

		it('should include registry and ls subcommands', () => {
			const args = listRegistriesCmd();
			expect(args).toContain('registry');
			expect(args).toContain('ls');
		});

		it('should accept table format', () => {
			const args = listRegistriesCmd({ format: 'table' });
			expect(args).toContain('--format');
			expect(args).toContain('table');
		});

		it('should accept json format explicitly', () => {
			const args = listRegistriesCmd({ format: 'json' });
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});
	});

	describe('registryLoginCmd', () => {
		it('should include registry as positional argument', () => {
			const args = registryLoginCmd('docker.io');
			expect(args).toContain('docker.io');
		});

		it('should include registry and login subcommands', () => {
			const args = registryLoginCmd('docker.io');
			expect(args).toContain('registry');
			expect(args).toContain('login');
		});

		it('should include --username when provided', () => {
			const args = registryLoginCmd('docker.io', { username: 'myuser' });
			expect(args).toContain('--username');
			expect(args).toContain('myuser');
		});

		it('should not include --username when not provided', () => {
			const args = registryLoginCmd('docker.io');
			expect(args).not.toContain('--username');
		});

		it('should include --password when provided', () => {
			const args = registryLoginCmd('docker.io', { password: 'mypass' });
			expect(args).toContain('--password');
			expect(args).toContain('mypass');
		});

		it('should not include --password when not provided', () => {
			const args = registryLoginCmd('docker.io');
			expect(args).not.toContain('--password');
		});

		it('should include both username and password when provided', () => {
			const args = registryLoginCmd('docker.io', {
				username: 'myuser',
				password: 'mypass'
			});
			expect(args).toContain('--username');
			expect(args).toContain('myuser');
			expect(args).toContain('--password');
			expect(args).toContain('mypass');
		});

		it('should work with various registry URLs', () => {
			const args = registryLoginCmd('registry.example.com:5000');
			expect(args).toContain('registry.example.com:5000');
		});

		it('should work with private registry', () => {
			const args = registryLoginCmd('my-private-registry.io', {
				username: 'admin',
				password: 'secret123'
			});
			expect(args).toContain('my-private-registry.io');
			expect(args).toContain('--username');
			expect(args).toContain('admin');
			expect(args).toContain('--password');
			expect(args).toContain('secret123');
		});
	});

	describe('registryLogoutCmd', () => {
		it('should include registry as positional argument', () => {
			const args = registryLogoutCmd('docker.io');
			expect(args).toContain('docker.io');
		});

		it('should include registry and logout subcommands', () => {
			const args = registryLogoutCmd('docker.io');
			expect(args).toContain('registry');
			expect(args).toContain('logout');
		});

		it('should work with various registry URLs', () => {
			const args = registryLogoutCmd('registry.example.com:5000');
			expect(args).toContain('registry.example.com:5000');
		});

		it('should work with private registry', () => {
			const args = registryLogoutCmd('my-private-registry.io');
			expect(args).toContain('my-private-registry.io');
		});

		it('should not include any options', () => {
			const args = registryLogoutCmd('docker.io');
			// Should only have subcommands and registry name
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});
	});
});
