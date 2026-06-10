/**
 * @fileoverview Tests for network commands
 */

import { describe, it, expect } from 'vitest';
import {
	listNetworksCmd,
	createNetworkCmd,
	removeNetworkCmd,
	deleteNetworkCmd,
	inspectNetworkCmd,
	pruneNetworksCmd
} from '../networks';

describe('Network Commands', () => {
	describe('listNetworksCmd', () => {
		it('should default to JSON format', () => {
			const args = listNetworksCmd();
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});

		it('should include network and ls subcommands', () => {
			const args = listNetworksCmd();
			expect(args).toContain('network');
			expect(args).toContain('ls');
		});

		it('should accept table format', () => {
			const args = listNetworksCmd({ format: 'table' });
			expect(args).toContain('--format');
			expect(args).toContain('table');
		});

		it('should accept json format explicitly', () => {
			const args = listNetworksCmd({ format: 'json' });
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});
	});

	describe('createNetworkCmd', () => {
		it('should include network name as positional argument', () => {
			const args = createNetworkCmd('my-network');
			expect(args).toContain('my-network');
		});

		it('should include network and create subcommands', () => {
			const args = createNetworkCmd('my-network');
			expect(args).toContain('network');
			expect(args).toContain('create');
		});

		it('should work with various network names', () => {
			const args = createNetworkCmd('app-network');
			expect(args).toContain('app-network');
		});

		it('should handle network names with hyphens and underscores', () => {
			const args = createNetworkCmd('my_network-123');
			expect(args).toContain('my_network-123');
		});
	});

	describe('removeNetworkCmd', () => {
		it('should include network name as positional argument', () => {
			const args = removeNetworkCmd(['my-network']);
			expect(args).toContain('my-network');
		});

		it('should include network and rm subcommands', () => {
			const args = removeNetworkCmd(['my-network']);
			expect(args).toContain('network');
			expect(args).toContain('rm');
		});

		it('should handle multiple networks', () => {
			const args = removeNetworkCmd(['net1', 'net2', 'net3']);
			expect(args).toContain('net1');
			expect(args).toContain('net2');
			expect(args).toContain('net3');
		});

		it('should work with readonly array', () => {
			const networkNames: readonly string[] = ['net1', 'net2'] as const;
			const args = removeNetworkCmd(networkNames);
			expect(args).toContain('net1');
			expect(args).toContain('net2');
		});

		it('should handle empty array', () => {
			const args = removeNetworkCmd([]);
			expect(args).toContain('network');
			expect(args).toContain('rm');
		});
	});

	describe('deleteNetworkCmd', () => {
		it('should be alias for removeNetworkCmd', () => {
			const removeArgs = removeNetworkCmd(['my-network']);
			const deleteArgs = deleteNetworkCmd(['my-network']);
			expect(deleteArgs).toEqual(removeArgs);
		});

		it('should handle multiple networks like removeNetworkCmd', () => {
			const removeArgs = removeNetworkCmd(['net1', 'net2', 'net3']);
			const deleteArgs = deleteNetworkCmd(['net1', 'net2', 'net3']);
			expect(deleteArgs).toEqual(removeArgs);
		});

		it('should work with readonly array like removeNetworkCmd', () => {
			const networkNames: readonly string[] = ['net1', 'net2'] as const;
			const removeArgs = removeNetworkCmd(networkNames);
			const deleteArgs = deleteNetworkCmd(networkNames);
			expect(deleteArgs).toEqual(removeArgs);
		});
	});

	describe('inspectNetworkCmd', () => {
		it('should include network name as positional argument', () => {
			const args = inspectNetworkCmd('my-network');
			expect(args).toContain('my-network');
		});

		it('should include network and inspect subcommands', () => {
			const args = inspectNetworkCmd('my-network');
			expect(args).toContain('network');
			expect(args).toContain('inspect');
		});

		it('should work with various network names', () => {
			const args = inspectNetworkCmd('app-network');
			expect(args).toContain('app-network');
		});
	});

	describe('pruneNetworksCmd', () => {
		it('should include network and prune subcommands', () => {
			const args = pruneNetworksCmd();
			expect(args).toContain('network');
			expect(args).toContain('prune');
		});

		it('should not include any positional arguments', () => {
			const args = pruneNetworksCmd();
			// Only subcommands should be present
			expect(args).toHaveLength(2);
			expect(args[0]).toBe('network');
			expect(args[1]).toBe('prune');
		});
	});
});
