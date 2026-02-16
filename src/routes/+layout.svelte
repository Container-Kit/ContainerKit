<script lang="ts">
    import '../app.css';
    import { containerizationStatus } from '$lib/services/containerization/system/service.js';
    import { isContainerizationActive } from '$lib/stores/containerization.svelte';
    import { hasContainerCli } from '$lib/services/containerization/setup';
    import { isSupportedVersion } from '$lib/stores/mac-os.svelte.js';
    import { Toaster } from '$lib/components/ui/sonner';
    import { mode, ModeWatcher } from 'mode-watcher';
    import { isLoading } from './loading.svelte';
    import { routes } from '$lib/helpers/routes';
    import { onDestroy, onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { IsIdle } from 'runed';

    isLoading.setTrue();
    let { children } = $props();
    let containerizationInterval: ReturnType<typeof setInterval> | null = $state(null);
    let currentPage = $derived(page.url.pathname);

    function isFallbackPage() {
        return [routes.ContainerizationStatus, routes.Setup, routes.Unsupported].includes(
            currentPage as never
        );
    }

    function watchContainerizationStatus() {
        return setInterval(async () => {
            try {
                const output = await containerizationStatus();
                if (output.error && !isFallbackPage()) {
                    toast.warning('Some error while getting containerization status.', {
                        description: output.stderr
                    });
                    isContainerizationActive.setFalse();
                    await goto(routes.ContainerizationStatus);
                    return;
                }

                if (
                    output.stdout.startsWith('apiserver is running') &&
                    !isContainerizationActive.current
                ) {
                    return isContainerizationActive.setTrue();
                }

                if (
                    output.stdout.startsWith('apiserver is not running') &&
                    isContainerizationActive.current &&
                    !isFallbackPage()
                ) {
                    isContainerizationActive.setFalse();
                    return goto(routes.ContainerizationStatus);
                }
            } catch (e) {
                if (isFallbackPage()) return;
                toast.warning('Some error while getting containerization status.' + e);
                isContainerizationActive.setFalse();
                await goto(routes.Setup);
                return;
            }
        }, 5000);
    }

    onMount(async () => {
        if (!isSupportedVersion()) return goto(routes.Unsupported);
        if (!(await hasContainerCli())) return goto(routes.Setup);
        containerizationInterval = watchContainerizationStatus();
    });

    onDestroy(async () => {
        if (containerizationInterval) {
            clearInterval(containerizationInterval);
        }
    });

    const isIdle = new IsIdle({ timeout: 5000 });

    $effect(() => {
        if (!isFallbackPage() && !isIdle.current && !containerizationInterval) {
            containerizationInterval = watchContainerizationStatus();
        }
    });
</script>

<ModeWatcher defaultMode="light" track={true} defaultTheme="container-kit" />
<Toaster theme={mode.current} richColors={true} closeButton={true} position="bottom-right" />

{@render children()}
