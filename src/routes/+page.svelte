<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Loader from '@lucide/svelte/icons/loader';
    import { isLoading } from './loading.svelte';
    import { startContainerization } from '$lib/services/containerization/system/service';
    import { toast } from 'svelte-sonner';
    import { isContainerizationActive } from '$lib/stores/containerization.svelte';
    import { isSupportedVersion } from '$lib/stores/mac-os.svelte.js';
    import { hasContainerCli } from '$lib/services/containerization/setup';
    import { createTray, destroyTray } from '$lib/services/tray/create';
    import { routes } from '$lib/helpers/routes';

    onMount(async () => {
        isLoading.setTrue();
        if (!isSupportedVersion()) return goto(routes.Unsupported);
        if (!(await hasContainerCli())) return goto(routes.Setup);
        const containerizationOutput = await startContainerization();

        if (!containerizationOutput.ok) {
            toast.error('Not able to start containerization process', {
                description: containerizationOutput.error
            });
            isContainerizationActive.setFalse();
            return goto(routes.ContainerizationStatus);
        }

        isContainerizationActive.setTrue();
        await createTray();
        await goto(routes.Containers);
        isLoading.setFalse();
    });

    onDestroy(async () => {
        await destroyTray();
    });
</script>

{#if isLoading.current}
    <div class="flex items-center justify-center h-screen w-full">
        <Loader class="size-5 animate-spin" />
    </div>
{/if}
