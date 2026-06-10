/**
 * @fileoverview Tests for DNS commands
 */

import { describe, it, expect } from 'vitest';
import {
	listDNSCmd,
	createDNSCmd,
	removeDNSCmd
} from '../dns';

describe('DNS Commands', () => {
	describe('listDNSCmd', () => {
		it('should include system, dns, and list subcommands', () => {
			const args = listDNSCmd();
			expect(args).toContain('system');
			expect(args).toContain('dns');
			expect(args).toContain('list');
		});

		it('should not include --format when format is not provided', () => {
			const args = listDNSCmd();
			expect(args).not.toContain('--format');
		});

		it('should include --format when format is json', () => {
			const args = listDNSCmd({ format: 'json' });
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});

		it('should include --format when format is table', () => {
			const args = listDNSCmd({ format: 'table' });
			expect(args).toContain('--format');
			expect(args).toContain('table');
		});

		it('should accept custom format option', () => {
			const args = listDNSCmd({ format: 'json' });
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});
	});

	describe('createDNSCmd', () => {
		it('should include domain as positional argument', () => {
			const args = createDNSCmd('example.com');
			expect(args).toContain('example.com');
		});

		it('should include system, dns, and create subcommands', () => {
			const args = createDNSCmd('example.com');
			expect(args).toContain('system');
			expect(args).toContain('dns');
			expect(args).toContain('create');
		});

		it('should work with various domain names', () => {
			const args = createDNSCmd('sub.example.com');
			expect(args).toContain('sub.example.com');
		});

		it('should work with localhost', () => {
			const args = createDNSCmd('localhost');
			expect(args).toContain('localhost');
		});

		it('should work with IP-like domains', () => {
			const args = createDNSCmd('127.0.0.1.local');
			expect(args).toContain('127.0.0.1.local');
		});

		it('should not include any options', () => {
			const args = createDNSCmd('example.com');
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});
	});

	describe('removeDNSCmd', () => {
		it('should include domain as positional argument', () => {
			const args = removeDNSCmd('example.com');
			expect(args).toContain('example.com');
		});

		it('should include system, dns, and delete subcommands', () => {
			const args = removeDNSCmd('example.com');
			expect(args).toContain('system');
			expect(args).toContain('dns');
			expect(args).toContain('delete');
		});

		it('should work with various domain names', () => {
			const args = removeDNSCmd('sub.example.com');
			expect(args).toContain('sub.example.com');
		});

		it('should work with localhost', () => {
			const args = removeDNSCmd('localhost');
			expect(args).toContain('localhost');
		});

		it('should not include any options', () => {
			const args = removeDNSCmd('example.com');
			expect(args.filter(arg => arg.startsWith('--'))).toHaveLength(0);
		});
	});
});
