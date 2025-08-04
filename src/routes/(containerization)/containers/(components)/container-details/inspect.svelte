<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import logs from './inspect.json?raw';
    import { highlightCode } from '$lib/helpers/highlight-code';
    import { inspectContainer } from '$lib/services/containerization/containers';
    import { toast } from 'svelte-sonner';

    type Props = {
        id: string;
    };

    let { id }: Props = $props();

    let code: string = $state('');
    let loadingInspectData = $state(false)

    onMount(async () => {
        loadingInspectData = true
        const output = await inspectContainer(id);

        if (output.error || output.stderr) {
            return toast.error(`Error while inspecting container ${id}`, {
                description: output.stderr
            })
        }

        code = await highlightCode(JSON.stringify(JSON.parse(output.stdout), null, 2), 'json');
        loadingInspectData = false
    });

    onDestroy(async () => {
        console.log('cleanup inspect');
    });
</script>

{#if loadingInspectData}
    <div class="flex flex-col items-center justify-center w-full h-full">
        Loading...
    </div>
{:else }
    <div class="px-5 bg-secondary dark:bg-secondary-foreground rounded-2xl w-full">
        {@html code}
    </div>
{/if}
