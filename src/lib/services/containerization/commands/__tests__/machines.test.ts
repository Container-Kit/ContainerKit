/**
 * @fileoverview Tests for machine commands
 */

import { describe, it, expect } from 'vitest';
import {
	listMachinesCmd,
	createMachineCmd,
	deleteMachineCmd,
	removeMachineCmd,
	inspectMachineCmd,
	runMachineCmd,
	stopMachineCmd,
	setMachineCmd,
	setDefaultMachineCmd,
	machineLogsCmd
} from '../machines';

describe('Machine Commands', () => {
	describe('listMachinesCmd', () => {
		it('should default to JSON format', () => {
			const args = listMachinesCmd();
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});

		it('should include machine and ls subcommands', () => {
			const args = listMachinesCmd();
			expect(args).toContain('machine');
			expect(args).toContain('ls');
		});

		it('should accept table format', () => {
			const args = listMachinesCmd({ format: 'table' });
			expect(args).toContain('--format');
			expect(args).toContain('table');
		});

		it('should accept json format explicitly', () => {
			const args = listMachinesCmd({ format: 'json' });
			expect(args).toContain('--format');
			expect(args).toContain('json');
		});
	});

	describe('createMachineCmd', () => {
		it('should include image ref as positional argument', () => {
			const args = createMachineCmd('ubuntu:latest');
			expect(args).toContain('ubuntu:latest');
		});

		it('should include machine and create subcommands', () => {
			const args = createMachineCmd('ubuntu:latest');
			expect(args).toContain('machine');
			expect(args).toContain('create');
		});

		it('should include --name when provided', () => {
			const args = createMachineCmd('ubuntu:latest', { name: 'my-machine' });
			expect(args).toContain('--name');
			expect(args).toContain('my-machine');
		});

		it('should not include --name when not provided', () => {
			const args = createMachineCmd('ubuntu:latest');
			expect(args).not.toContain('--name');
		});

		it('should include --cpus when provided', () => {
			const args = createMachineCmd('ubuntu:latest', { cpus: 4 });
			expect(args).toContain('--cpus');
			expect(args).toContain('4');
		});

		it('should not include --cpus when not provided', () => {
			const args = createMachineCmd('ubuntu:latest');
			expect(args).not.toContain('--cpus');
		});

		it('should include --memory when provided', () => {
			const args = createMachineCmd('ubuntu:latest', { memory: '2G' });
			expect(args).toContain('--memory');
			expect(args).toContain('2G');
		});

		it('should not include --memory when not provided', () => {
			const args = createMachineCmd('ubuntu:latest');
			expect(args).not.toContain('--memory');
		});

		it('should include all options together', () => {
			const args = createMachineCmd('ubuntu:latest', {
				name: 'dev-machine',
				cpus: 8,
				memory: '4G'
			});
			expect(args).toContain('--name');
			expect(args).toContain('dev-machine');
			expect(args).toContain('--cpus');
			expect(args).toContain('8');
			expect(args).toContain('--memory');
			expect(args).toContain('4G');
		});
	});

	describe('deleteMachineCmd', () => {
		it('should include machine name as positional argument', () => {
			const args = deleteMachineCmd(['my-machine']);
			expect(args).toContain('my-machine');
		});

		it('should include machine and rm subcommands', () => {
			const args = deleteMachineCmd(['my-machine']);
			expect(args).toContain('machine');
			expect(args).toContain('rm');
		});

		it('should handle multiple machines', () => {
			const args = deleteMachineCmd(['machine1', 'machine2', 'machine3']);
			expect(args).toContain('machine1');
			expect(args).toContain('machine2');
			expect(args).toContain('machine3');
		});

		it('should work with readonly array', () => {
			const machineNames: readonly string[] = ['m1', 'm2'] as const;
			const args = deleteMachineCmd(machineNames);
			expect(args).toContain('m1');
			expect(args).toContain('m2');
		});
	});

	describe('removeMachineCmd', () => {
		it('should be alias for deleteMachineCmd', () => {
			const deleteArgs = deleteMachineCmd(['my-machine']);
			const removeArgs = removeMachineCmd(['my-machine']);
			expect(removeArgs).toEqual(deleteArgs);
		});

		it('should handle multiple machines like deleteMachineCmd', () => {
			const deleteArgs = deleteMachineCmd(['m1', 'm2', 'm3']);
			const removeArgs = removeMachineCmd(['m1', 'm2', 'm3']);
			expect(removeArgs).toEqual(deleteArgs);
		});
	});

	describe('inspectMachineCmd', () => {
		it('should include machine name as positional argument', () => {
			const args = inspectMachineCmd('my-machine');
			expect(args).toContain('my-machine');
		});

		it('should include machine and inspect subcommands', () => {
			const args = inspectMachineCmd('my-machine');
			expect(args).toContain('machine');
			expect(args).toContain('inspect');
		});

		it('should work with various machine names', () => {
			const args = inspectMachineCmd('dev-machine');
			expect(args).toContain('dev-machine');
		});
	});

	describe('runMachineCmd', () => {
		it('should include machine name with --name option', () => {
			const args = runMachineCmd('my-machine', ['ls', '-la']);
			expect(args).toContain('--name');
			expect(args).toContain('my-machine');
		});

		it('should include command arguments', () => {
			const args = runMachineCmd('my-machine', ['sh', '-c', 'echo hello']);
			expect(args).toContain('sh');
			expect(args).toContain('-c');
			expect(args).toContain('echo hello');
		});

		it('should include machine and run subcommands', () => {
			const args = runMachineCmd('my-machine', ['ls']);
			expect(args).toContain('machine');
			expect(args).toContain('run');
		});

		it('should handle complex commands', () => {
			const args = runMachineCmd('build-machine', ['apt-get', 'install', '-y', 'curl']);
			expect(args).toContain('apt-get');
			expect(args).toContain('install');
			expect(args).toContain('-y');
			expect(args).toContain('curl');
		});

		it('should work with readonly command array', () => {
			const cmd: readonly string[] = ['echo', 'test'] as const;
			const args = runMachineCmd('my-machine', cmd);
			expect(args).toContain('echo');
			expect(args).toContain('test');
		});
	});

	describe('stopMachineCmd', () => {
		it('should include machine name as positional argument', () => {
			const args = stopMachineCmd('my-machine');
			expect(args).toContain('my-machine');
		});

		it('should include machine and stop subcommands', () => {
			const args = stopMachineCmd('my-machine');
			expect(args).toContain('machine');
			expect(args).toContain('stop');
		});

		it('should work with various machine names', () => {
			const args = stopMachineCmd('dev-machine');
			expect(args).toContain('dev-machine');
		});
	});

	describe('setMachineCmd', () => {
		it('should include machine name with -n flag', () => {
			const args = setMachineCmd('my-machine', { key: 'value' });
			expect(args).toContain('-n');
			expect(args).toContain('my-machine');
		});

		it('should include properties as key=value pairs', () => {
			const args = setMachineCmd('my-machine', { cpus: '4', memory: '2G' });
			expect(args).toContain('cpus=4');
			expect(args).toContain('memory=2G');
		});

		it('should include machine and set subcommands', () => {
			const args = setMachineCmd('my-machine', { key: 'value' });
			expect(args).toContain('machine');
			expect(args).toContain('set');
		});

		it('should handle multiple properties', () => {
			const properties = {
				setting1: 'value1',
				setting2: 'value2',
				setting3: 'value3'
			};
			const args = setMachineCmd('my-machine', properties);
			expect(args).toContain('setting1=value1');
			expect(args).toContain('setting2=value2');
			expect(args).toContain('setting3=value3');
		});

		it('should handle empty properties object', () => {
			const args = setMachineCmd('my-machine', {});
			expect(args).toContain('machine');
			expect(args).toContain('set');
			expect(args).toContain('-n');
			expect(args).toContain('my-machine');
		});
	});

	describe('setDefaultMachineCmd', () => {
		it('should include machine name as positional argument', () => {
			const args = setDefaultMachineCmd('my-machine');
			expect(args).toContain('my-machine');
		});

		it('should include machine and set-default subcommands', () => {
			const args = setDefaultMachineCmd('my-machine');
			expect(args).toContain('machine');
			expect(args).toContain('set-default');
		});

		it('should work with various machine names', () => {
			const args = setDefaultMachineCmd('primary-machine');
			expect(args).toContain('primary-machine');
		});
	});

	describe('machineLogsCmd', () => {
		it('should include machine name as positional argument', () => {
			const args = machineLogsCmd('my-machine');
			expect(args).toContain('my-machine');
		});

		it('should include machine and logs subcommands', () => {
			const args = machineLogsCmd('my-machine');
			expect(args).toContain('machine');
			expect(args).toContain('logs');
		});

		it('should work with various machine names', () => {
			const args = machineLogsCmd('dev-machine');
			expect(args).toContain('dev-machine');
		});
	});
});
