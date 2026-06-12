<script lang="ts">
    import type { ContainerClient } from '$lib/models/container';
    import { onDestroy, onMount } from 'svelte';
    import ContainersPage from './(components)/containers-page.svelte';
    import { columns } from './(components)/columns.svelte';
    import { getAllContainers, removeContainer } from '$lib/services/containerization/containers';
    import { toast } from 'svelte-sonner';
    import { watchContainerChanges } from '$lib/services/fs-events/containers';
    import type { UnwatchFn } from '@tauri-apps/plugin-fs';

    let allContainers: Array<ContainerClient> = $state([]);
    let runningContainers: Array<ContainerClient> = $derived(
        allContainers.filter((container) => container.status.state === 'running')
    );
    let showOnlyRunningContainers = $state(false);
    let containerChangeWatcher: UnwatchFn | null = $state(null);

    async function getAllContainerList() {
        const output = await getAllContainers();

        if (!output.ok) {
            toast.error('Error in getting container list', {
                description: output.error
            });
            return;
        }

        allContainers = output.data;
    }

    async function deleteContainer(id: string) {
        await getAllContainerList();
        const isRunning = runningContainers.find((container) => container.configuration.id === id);
        if (isRunning) {
            toast.error(`You can't delete a running container`);
            return;
        }
        const output = await removeContainer(id);
        if (!output.ok) {
            toast.error(`Unable to delete ${id} container`, {
                description: output.error
            });
            return;
        }

        toast.success(`Successfully deleted ${id} container`);
    }

    onMount(async () => {
        await getAllContainerList();
        containerChangeWatcher = await watchContainerChanges(getAllContainerList, 500);
    });

    onDestroy(() => {
        if (containerChangeWatcher) {
            containerChangeWatcher();
        }
    });
</script>

<div class="flex flex-1 flex-col">
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ContainersPage
                data={showOnlyRunningContainers ? runningContainers : allContainers}
                columns={columns({ deleteContainer })}
                bind:showOnlyRunningContainers
            />
        </div>
    </div>
</div>
