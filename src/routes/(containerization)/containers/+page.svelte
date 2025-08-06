<script lang="ts">
    import type { ContainerClient } from '$lib/models/container';
    import { onDestroy, onMount } from 'svelte';
    import ContainerList from './(components)/container-list.svelte';
    import { columns } from './(components)/columns.svelte';
    import { getAllContainers, removeContainer } from '$lib/services/containerization/containers';
    import { toast } from 'svelte-sonner';
    import { watchContainerChanges } from '$lib/services/fs-events/containers';
    import type { UnwatchFn } from '@tauri-apps/plugin-fs';
    import { watchDnsResolverChanges } from '$lib/services/fs-events/dns';

    type ErrorLog = {
        message: string;
        stderr: string;
        stdout: string;
    };

    let allContainers: Array<ContainerClient> = $state([]);
    let runningContainers: Array<ContainerClient> = $state([]);
    let showOnlyRunningContainers = $state(false);
    let containerChangeWatcher: UnwatchFn | null = $state(null)
    let dnsChangeWatcher: UnwatchFn | null = $state(null)
    let error: ErrorLog | null = $state(null);

    async function getAllContainerList() {
        const output = await getAllContainers();

        if (output.error) {
            // error = output;
            return;
        }

        if (!output.stdout) {
            // error = output;
            return;
        }

        allContainers = JSON.parse(output.stdout) ?? [];
        if (allContainers.length > 0) {
            runningContainers = allContainers.filter(
                (container: ContainerClient) => container.status === 'running'
            );
        }
    }

    async function deleteContainer(id: string) {
        await getAllContainerList();
        const isRunning = runningContainers.find((container) => container.configuration.id === id);
        if (isRunning) {
            toast.error(`You can't delete a running container`);
            return;
        }
        const output = await removeContainer(id);
        if (output.error) {
            toast.error(`Unable to delete ${id} container`);
            return;
        }

        if (!output.stdout) {
            toast.error(`Unable to delete ${id} container`);
            return;
        }
        // await getAllContainerList();
        toast.success(`Successfully deleted ${id} container`);
    }

    onMount(async () => {
        await getAllContainerList();
        containerChangeWatcher = await watchContainerChanges(getAllContainerList, 500)
        dnsChangeWatcher = await watchDnsResolverChanges(getAllContainerList, 1000)
    });

    onDestroy(() => {
        if (containerChangeWatcher) {
            containerChangeWatcher()
        }
        if (dnsChangeWatcher) {
            dnsChangeWatcher()
        }
    })
</script>

<div class="flex flex-1 flex-col">
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ContainerList
                data={showOnlyRunningContainers ? runningContainers : allContainers}
                columns={columns({ getAllContainerList, deleteContainer })}
                getAllContainers={getAllContainerList}
                bind:showOnlyRunningContainers
            />
        </div>
    </div>
</div>

<!--<Terminal />-->