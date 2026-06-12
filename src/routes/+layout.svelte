<script lang="ts">
    import '../app.css';
    import { containerizationStatus } from '$lib/services/containerization/system/service.js';
    import { isContainerizationActive } from '$lib/stores/containerization.svelte';
    import { hasContainerCli } from '$lib/services/containerization/setup';
    import { isSupportedVersion } from '$lib/stores/mac-os.svelte.js';
    import { Toaster } from '$lib/components/ui/sonner';
    import { mode, ModeWatcher } from 'mode-watcher';
    import { routes } from '$lib/helpers/routes';
    import { onDestroy, onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    let { children } = $props();
    let containerizationInterval: ReturnType<typeof setInterval> | null = null;
    let currentPage = $derived(page.url.pathname);

    // Pages that manage containerization state themselves; the poller never
    // redirects away from them. Home is exempt because the root page is the
    // bootstrapper (it runs `system start` which can take longer than a tick).
    const exemptPages: string[] = [
        routes.Home,
        routes.ContainerizationStatus,
        routes.Setup,
        routes.Unsupported
    ];

    function watchContainerizationStatus() {
        return setInterval(async () => {
            const output = await containerizationStatus();
            const isRunning = output.ok && output.data.status === 'running';

            if (isRunning) {
                isContainerizationActive.setTrue();
                // recover once the apiserver is back
                if (currentPage === routes.ContainerizationStatus) {
                    await goto(routes.Containers);
                }
                return;
            }

            // not running: only react on the running -> stopped transition so
            // we toast and redirect once instead of every tick
            if (!isContainerizationActive.current) return;
            isContainerizationActive.setFalse();
            if (!exemptPages.includes(currentPage)) {
                toast.warning('Containerization stopped', {
                    description: output.ok
                        ? 'The container apiserver is no longer running.'
                        : output.error
                });
                await goto(routes.ContainerizationStatus);
            }
        }, 5000);
    }

    onMount(async () => {
        // safe to start before the gates below: ticks are no-ops until
        // containerization first becomes active
        containerizationInterval = watchContainerizationStatus();
        if (!isSupportedVersion()) return goto(routes.Unsupported);
        if (!(await hasContainerCli())) return goto(routes.Setup);
    });

    onDestroy(() => {
        if (containerizationInterval) {
            clearInterval(containerizationInterval);
        }
    });
</script>

<ModeWatcher defaultMode="light" track={true} />
<Toaster theme={mode.current} richColors={true} closeButton={true} position="bottom-right" />

{@render children()}
