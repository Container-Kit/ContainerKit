<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import { highlightCode } from '$lib/helpers/highlight-code';
    import { Child, Command } from '@tauri-apps/plugin-shell';

    type Props = {
        id: string;
    };

    let { id }: Props = $props();

    let processChild: Child | null = $state(null);
    let logs: string[] = $state([]);
    let code: string = $state('');

    async function streamContainerLogs(): Promise<Child> {
        const command = Command.create('container', ['logs', id, '-f'], {
            encoding: 'utf8'
        });
        command.on('close', (data) => {
            console.log(data);
            console.log(`command finished with code ${data.code} and signal ${data.signal}`);
        });
        command.on('error', (error) => console.error(`command error: "${error}"`));
        command.stdout.on('data', (line) => logs.push(line));
        command.stderr.on('data', (line) => logs.push(line));
        const child = await command.spawn();
        return child;
    }

    $effect(() => {
        async function updateHighlightedCode() {
            if (logs.length > 0) {
                // Only highlight if there are logs
                code = await highlightCode(logs.join('\n'));
            } else {
                code = ''; // Clear code if no logs
            }
        }

        updateHighlightedCode();
    });

    onMount(async () => {
        processChild = await streamContainerLogs();
    });

    onDestroy(async () => {
        if (processChild) {
            await processChild.kill();
        }
    });
</script>

<ScrollArea class="p-2 h-full w-full rounded-3xl no-scrollbar" orientation="vertical">
    {#if code}
        <div class="px-5 bg-secondary dark:bg-secondary-foreground rounded-2xl w-full">
            {@html code}
        </div>
    {:else}
        <div class="flex flex-col items-center justify-center h-full w-full">
            <h3>No logs</h3>
        </div>
    {/if}
</ScrollArea>
