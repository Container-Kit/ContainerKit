/**
 * @fileoverview Tests for the commands module
 */

import { describe, it, expect } from 'vitest';
import {
    buildArgs,
    // Container commands
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
    pruneContainersCmd,
    // Image commands
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
    pruneImagesCmd,
    // Volume commands
    listVolumesCmd,
    createVolumeCmd,
    removeVolumeCmd,
    deleteVolumeCmd,
    inspectVolumeCmd,
    pruneVolumesCmd,
    // Network commands
    listNetworksCmd,
    createNetworkCmd,
    removeNetworkCmd,
    deleteNetworkCmd,
    inspectNetworkCmd,
    pruneNetworksCmd,
    // Machine commands
    listMachinesCmd,
    createMachineCmd,
    deleteMachineCmd,
    removeMachineCmd,
    inspectMachineCmd,
    runMachineCmd,
    stopMachineCmd,
    setMachineCmd,
    setDefaultMachineCmd,
    machineLogsCmd,
    // Registry commands
    listRegistriesCmd,
    registryLoginCmd,
    registryLogoutCmd,
    // System commands
    versionCmd,
    statusCmd,
    systemDfCmd,
    systemLogsCmd,
    systemStartCmd,
    systemStopCmd,
    // DNS commands
    listDNSCmd,
    createDNSCmd,
    removeDNSCmd,
    // Builder commands
    startBuilderCmd,
    stopBuilderCmd,
    builderStatusCmd,
    deleteBuilderCmd,
    removeBuilderCmd
} from '../commands';

describe('Commands', () => {
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

    describe('Container commands', () => {
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

    describe('Image commands', () => {
        it('listImagesCmd should default to JSON format', () => {
            const args = listImagesCmd();
            expect(args).toContain('--format');
            expect(args).toContain('json');
        });

        it('pullImageCmd should include image reference', () => {
            const args = pullImageCmd('alpine:latest');
            expect(args).toContain('alpine:latest');
        });

        it('pushImageCmd should include image reference', () => {
            const args = pushImageCmd('myregistry/myimage:latest');
            expect(args).toContain('myregistry/myimage:latest');
        });

        it('removeImageCmd should include image references', () => {
            const args = removeImageCmd(['image1:tag1', 'image2:tag2']);
            expect(args).toContain('image1:tag1');
            expect(args).toContain('image2:tag2');
        });

        it('deleteImageCmd should be alias for removeImageCmd', () => {
            const removeArgs = removeImageCmd(['image1']);
            const deleteArgs = deleteImageCmd(['image1']);
            expect(deleteArgs).toEqual(removeArgs);
        });

        it('inspectImageCmd should include image reference', () => {
            const args = inspectImageCmd('alpine:latest');
            expect(args).toContain('alpine:latest');
        });

        it('saveImageCmd should include output path', () => {
            const args = saveImageCmd('alpine:latest', '/path/to/image.tar');
            expect(args).toContain('--output');
            expect(args).toContain('/path/to/image.tar');
            expect(args).toContain('alpine:latest');
        });

        it('loadImageCmd should include input path', () => {
            const args = loadImageCmd('/path/to/image.tar');
            expect(args).toContain('--input');
            expect(args).toContain('/path/to/image.tar');
        });

        it('tagImageCmd should include source and target refs', () => {
            const args = tagImageCmd('image:old', 'image:new');
            expect(args).toContain('image:old');
            expect(args).toContain('image:new');
        });

        it('buildImageCmd should include dockerfile and context path', () => {
            const args = buildImageCmd('Dockerfile', '/path/to/context');
            expect(args).toContain('-f');
            expect(args).toContain('Dockerfile');
            expect(args).toContain('/path/to/context');
        });

        it('pruneImagesCmd should include --all flag when requested', () => {
            const args = pruneImagesCmd(true);
            expect(args).toContain('--all');
        });
    });

    describe('Volume commands', () => {
        it('listVolumesCmd should default to JSON format', () => {
            const args = listVolumesCmd();
            expect(args).toContain('--format');
            expect(args).toContain('json');
        });

        it('createVolumeCmd should include volume name', () => {
            const args = createVolumeCmd('my-volume');
            expect(args).toContain('my-volume');
        });

        it('removeVolumeCmd should include volume names', () => {
            const args = removeVolumeCmd(['volume1', 'volume2']);
            expect(args).toContain('volume1');
            expect(args).toContain('volume2');
        });

        it('deleteVolumeCmd should be alias for removeVolumeCmd', () => {
            const removeArgs = removeVolumeCmd(['volume1']);
            const deleteArgs = deleteVolumeCmd(['volume1']);
            expect(deleteArgs).toEqual(removeArgs);
        });

        it('inspectVolumeCmd should include volume name', () => {
            const args = inspectVolumeCmd('my-volume');
            expect(args).toContain('my-volume');
        });

        it('pruneVolumesCmd should build correct args', () => {
            const args = pruneVolumesCmd();
            expect(args).toContain('volume');
            expect(args).toContain('prune');
        });
    });

    describe('Network commands', () => {
        it('listNetworksCmd should default to JSON format', () => {
            const args = listNetworksCmd();
            expect(args).toContain('--format');
            expect(args).toContain('json');
        });

        it('createNetworkCmd should include network name', () => {
            const args = createNetworkCmd('my-network');
            expect(args).toContain('my-network');
        });

        it('removeNetworkCmd should include network names', () => {
            const args = removeNetworkCmd(['network1', 'network2']);
            expect(args).toContain('network1');
            expect(args).toContain('network2');
        });

        it('deleteNetworkCmd should be alias for removeNetworkCmd', () => {
            const removeArgs = removeNetworkCmd(['network1']);
            const deleteArgs = deleteNetworkCmd(['network1']);
            expect(deleteArgs).toEqual(removeArgs);
        });

        it('inspectNetworkCmd should include network name', () => {
            const args = inspectNetworkCmd('my-network');
            expect(args).toContain('my-network');
        });

        it('pruneNetworksCmd should build correct args', () => {
            const args = pruneNetworksCmd();
            expect(args).toContain('network');
            expect(args).toContain('prune');
        });
    });

    describe('Machine commands', () => {
        it('listMachinesCmd should default to JSON format', () => {
            const args = listMachinesCmd();
            expect(args).toContain('--format');
            expect(args).toContain('json');
        });

        it('createMachineCmd should include image ref and options', () => {
            const args = createMachineCmd('alpine:latest', {
                name: 'my-machine',
                cpus: 4,
                memory: '8G'
            });
            expect(args).toContain('alpine:latest');
            expect(args).toContain('--name');
            expect(args).toContain('my-machine');
            expect(args).toContain('--cpus');
            expect(args).toContain('4');
        });

        it('deleteMachineCmd should include machine names', () => {
            const args = deleteMachineCmd(['machine1', 'machine2']);
            expect(args).toContain('machine1');
            expect(args).toContain('machine2');
        });

        it('removeMachineCmd should be alias for deleteMachineCmd', () => {
            const deleteArgs = deleteMachineCmd(['machine1']);
            const removeArgs = removeMachineCmd(['machine1']);
            expect(removeArgs).toEqual(deleteArgs);
        });

        it('inspectMachineCmd should include machine name', () => {
            const args = inspectMachineCmd('my-machine');
            expect(args).toContain('my-machine');
        });

        it('runMachineCmd should include machine name and command', () => {
            const args = runMachineCmd('my-machine', ['uname', '-a']);
            expect(args).toContain('--name');
            expect(args).toContain('my-machine');
            expect(args).toContain('uname');
        });

        it('stopMachineCmd should include machine name', () => {
            const args = stopMachineCmd('my-machine');
            expect(args).toContain('my-machine');
        });

        it('setMachineCmd should include properties', () => {
            const args = setMachineCmd('my-machine', { cpus: '4', memory: '8G' });
            expect(args).toContain('-n');
            expect(args).toContain('my-machine');
            expect(args.some((arg) => arg.includes('cpus='))).toBe(true);
        });

        it('setDefaultMachineCmd should include machine name', () => {
            const args = setDefaultMachineCmd('my-machine');
            expect(args).toContain('my-machine');
        });

        it('machineLogsCmd should include machine name', () => {
            const args = machineLogsCmd('my-machine');
            expect(args).toContain('my-machine');
        });
    });

    describe('Registry commands', () => {
        it('listRegistriesCmd should default to JSON format', () => {
            const args = listRegistriesCmd();
            expect(args).toContain('--format');
            expect(args).toContain('json');
        });

        it('registryLoginCmd should include registry and options', () => {
            const args = registryLoginCmd('docker.io', { username: 'user' });
            expect(args).toContain('docker.io');
            expect(args).toContain('--username');
            expect(args).toContain('user');
        });

        it('registryLogoutCmd should include registry', () => {
            const args = registryLogoutCmd('docker.io');
            expect(args).toContain('docker.io');
        });
    });

    describe('System commands', () => {
        it('versionCmd should build correct args', () => {
            const args = versionCmd();
            expect(args).toContain('version');
        });

        it('statusCmd should build correct args', () => {
            const args = statusCmd();
            expect(args).toContain('status');
        });

        it('systemDfCmd should build correct args', () => {
            const args = systemDfCmd({ format: 'json' });
            expect(args).toContain('df');
            expect(args).toContain('--format');
            expect(args).toContain('json');
        });

        it('systemLogsCmd should build correct args', () => {
            const args = systemLogsCmd();
            expect(args).toContain('logs');
        });

        it('systemStartCmd should build correct args', () => {
            const args = systemStartCmd();
            expect(args).toContain('start');
        });

        it('systemStopCmd should build correct args', () => {
            const args = systemStopCmd();
            expect(args).toContain('stop');
        });
    });

    describe('DNS commands', () => {
        it('listDNSCmd should build correct args', () => {
            const args = listDNSCmd();
            expect(args).toContain('dns');
            expect(args).toContain('list');
        });

        it('createDNSCmd should include domain', () => {
            const args = createDNSCmd('example.local');
            expect(args).toContain('example.local');
        });

        it('removeDNSCmd should include domain', () => {
            const args = removeDNSCmd('example.local');
            expect(args).toContain('example.local');
        });
    });

    describe('Builder commands', () => {
        it('startBuilderCmd should build correct args', () => {
            const args = startBuilderCmd();
            expect(args).toContain('builder');
            expect(args).toContain('start');
        });

        it('stopBuilderCmd should build correct args', () => {
            const args = stopBuilderCmd();
            expect(args).toContain('builder');
            expect(args).toContain('stop');
        });

        it('builderStatusCmd should build correct args', () => {
            const args = builderStatusCmd();
            expect(args).toContain('builder');
            expect(args).toContain('status');
        });

        it('deleteBuilderCmd should build correct args', () => {
            const args = deleteBuilderCmd();
            expect(args).toContain('builder');
            expect(args).toContain('rm');
        });

        it('removeBuilderCmd should be alias for deleteBuilderCmd', () => {
            const deleteArgs = deleteBuilderCmd();
            const removeArgs = removeBuilderCmd();
            expect(removeArgs).toEqual(deleteArgs);
        });
    });
});
