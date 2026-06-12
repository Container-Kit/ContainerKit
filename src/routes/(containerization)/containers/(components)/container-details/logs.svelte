<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { highlightCode } from '$lib/helpers/highlight-code';
    import { Child, Command } from '@tauri-apps/plugin-shell';
    import { watchContainerDir, watchContainerLogFile } from '$lib/services/fs-events/containers';
    import type { UnwatchFn } from '@tauri-apps/plugin-fs';
    import { getContainerLogs } from '$lib/services/containerization/containers';
    import { toast } from 'svelte-sonner';

    type Props = {
        id: string;
    };

    let { id }: Props = $props();

    let containerLogFileWatcher: UnwatchFn | null = $state(null);

    let childProcess: Child | null = $state(null);
    let logs: string[] = $state([]);
    let code: string = $state('');

    async function streamContainerLogs() {
        console.log('called ik');
        const output = await getContainerLogs(id);
        if (!output.ok) {
            toast.error(output.error);
            return;
        }

        logs = output.data ? output.data.split('\n') : [];
    }

    onMount(async () => {
        await streamContainerLogs();
        // containerLogFileWatcher = await watchContainerLogFile(id, streamContainerLogs);
        containerLogFileWatcher = await watchContainerDir(id, streamContainerLogs);
    });

    $effect(() => {
        async function updateHighlightedCode() {
            console.log('logs updated', logs);
            if (logs.length > 0) {
                code = await highlightCode(logs.join('\n'));
            } else {
                code = '';
            }
        }

        updateHighlightedCode();
    });

    // onMount(async () => {
    //     childProcess = await streamContainerLogs();
    // });

    onDestroy(async () => {
        if (containerLogFileWatcher) {
            containerLogFileWatcher();
        }
    });
</script>

{#if code}
    <div class="px-5 bg-secondary dark:bg-secondary-foreground rounded-2xl w-full">
        {@html code}
    </div>
{:else}
    <div class="flex flex-col items-center justify-center h-full w-full">
        <h3>No logs</h3>
    </div>
{/if}
