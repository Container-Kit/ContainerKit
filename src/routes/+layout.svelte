<script lang="ts">
    import '../app.css';
    import { Toaster } from '$lib/components/ui/sonner';
    import { mode, ModeWatcher } from 'mode-watcher';
    import { isSupportedVersion } from '$lib/stores/mac-os.svelte.js';
    import {
        containerizationStatus,
        startContainerization
    } from '$lib/services/containerization/system/service.js';
    import { onDestroy } from 'svelte';
    import { isContainerizationActive } from '$lib/stores/containerization.svelte';
    import { toast } from 'svelte-sonner';
    import { goto } from '$app/navigation';

    let { children } = $props();
    let containerizationInterval: ReturnType<typeof setInterval> | null = $state(null);

    if (isSupportedVersion()) {
        startContainerization();
        isContainerizationActive.setTrue();
        containerizationInterval = setInterval(async () => {
            const output = await containerizationStatus();
            if (output.error) {
                toast.warning('Some error while getting containerization status.', {
                    description: output.stderr
                });
                return isContainerizationActive.setFalse();
            }

            if (
                output.stdout.startsWith('apiserver is running') &&
                !isContainerizationActive.current
            ) {
                return isContainerizationActive.setTrue();
            }

            if (
                output.stdout.startsWith('apiserver is not running') &&
                isContainerizationActive.current
            ) {
                isContainerizationActive.setFalse();
                return goto('/containerization-status');
            }
        }, 5000);
    }

    onDestroy(() => {
        if (containerizationInterval) {
            clearInterval(containerizationInterval);
        }
    });
</script>

<ModeWatcher defaultMode="light" track={true} defaultTheme="perpetuity" />
<Toaster theme={mode.current} richColors={true} closeButton={true} position="top-right" />

{@render children()}
