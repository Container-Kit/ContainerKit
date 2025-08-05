<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { highlightCode } from '$lib/helpers/highlight-code';
    import { inspectContainer } from '$lib/services/containerization/containers';
    import { toast } from 'svelte-sonner';

    type Props = {
        id: string;
    };

    let { id }: Props = $props();

    let inspectJson: string = $state('');
    let loadingInspectData = $state(false)

    onMount(async () => {
        loadingInspectData = true
        const output = await inspectContainer(id);

        if (output.error || output.stderr) {
            return toast.error(`Error while inspecting container ${id}`, {
                description: output.stderr
            })
        }

        inspectJson = await highlightCode(JSON.stringify(JSON.parse(output.stdout), null, 2), 'json');
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
        {@html inspectJson}
    </div>
{/if}
