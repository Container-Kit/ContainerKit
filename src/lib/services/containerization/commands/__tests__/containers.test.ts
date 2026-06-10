/**
 * @fileoverview Tests for container commands
 */

import { describe, it, expect } from 'vitest';
import {
	listContainersCmd,
	createContainerCmd,
	runContainerCmd,
	startContainerCmd,
	stopContainerCmd,
	removeContainerCmd,
	deleteContainerCmd,
	inspectContainerCmd,
	logsContainerCmd,
	execContainerCmd,
	copyContainerCmd,
	killContainerCmd,
	exportContainerCmd,
	statsContainerCmd,
	pruneContainersCmd
} from '../containers';

describe('Container Commands', () => {
	it('listContainersCmd should default to JSON format', () => {
		const args = listContainersCmd();
		expect(args).toContain('--format');
		expect(args).toContain('json');
	});

	it('listContainersCmd should include --all when requested', () => {
		const args = listContainersCmd({ all: true });
		expect(args).toContain('--all');
	});

	it('createContainerCmd should include image ref and name', () => {
		const args = createContainerCmd('alpine:latest', { name: 'my-container' });
		expect(args).toContain('alpine:latest');
		expect(args).toContain('--name');
		expect(args).toContain('my-container');
	});

	it('runContainerCmd should include image ref and options', () => {
		const args = runContainerCmd('alpine:latest', { detach: true });
		expect(args).toContain('alpine:latest');
		expect(args).toContain('--detach');
	});

	it('startContainerCmd should include container ID', () => {
		const args = startContainerCmd('my-container');
		expect(args).toContain('my-container');
	});

	it('stopContainerCmd should include container ID', () => {
		const args = stopContainerCmd('my-container');
		expect(args).toContain('my-container');
	});

	it('removeContainerCmd should include all container IDs', () => {
		const args = removeContainerCmd(['container1', 'container2']);
		expect(args).toContain('container1');
		expect(args).toContain('container2');
	});

	it('removeContainerCmd should include --force flag when requested', () => {
		const args = removeContainerCmd(['container1'], true);
		expect(args).toContain('--force');
	});

	it('deleteContainerCmd should be alias for removeContainerCmd', () => {
		const removeArgs = removeContainerCmd(['container1']);
		const deleteArgs = deleteContainerCmd(['container1']);
		expect(deleteArgs).toEqual(removeArgs);
	});

	it('inspectContainerCmd should include container ID', () => {
		const args = inspectContainerCmd('my-container');
		expect(args).toContain('my-container');
	});

	it('logsContainerCmd should include container ID', () => {
		const args = logsContainerCmd('my-container');
		expect(args).toContain('my-container');
	});

	it('logsContainerCmd should include options when provided', () => {
		const args = logsContainerCmd('my-container', { tail: 100 });
		expect(args).toContain('--tail');
		expect(args).toContain('100');
	});

	it('execContainerCmd should include container ID and command', () => {
		const args = execContainerCmd('my-container', ['sh', '-c', 'echo test']);
		expect(args).toContain('my-container');
		expect(args).toContain('sh');
	});

	it('copyContainerCmd should include source and destination', () => {
		const args = copyContainerCmd('container:/src', '/dst');
		expect(args).toContain('container:/src');
		expect(args).toContain('/dst');
	});

	it('killContainerCmd should include container IDs', () => {
		const args = killContainerCmd(['container1', 'container2']);
		expect(args).toContain('container1');
		expect(args).toContain('container2');
	});

	it('killContainerCmd should include signal when provided', () => {
		const args = killContainerCmd(['container1'], 'SIGTERM');
		expect(args).toContain('--signal');
		expect(args).toContain('SIGTERM');
	});

	it('exportContainerCmd should include output path', () => {
		const args = exportContainerCmd('my-container', '/path/to/export.tar');
		expect(args).toContain('--output');
		expect(args).toContain('/path/to/export.tar');
	});

	it('statsContainerCmd should include format option', () => {
		const args = statsContainerCmd([], { format: 'json' });
		expect(args).toContain('--format');
		expect(args).toContain('json');
	});

	it('pruneContainersCmd should build correct args', () => {
		const args = pruneContainersCmd(true);
		expect(args).toContain('prune');
		expect(args).toContain('--force');
	});
});
