<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import logs from './inspect.json?raw';
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import { highlightCode } from '$lib/helpers/highlight-code';

    let code: string = $state('');

    onMount(async () => {
        code = await highlightCode(JSON.stringify(JSON.parse(logs), null, 2), 'json');
    });

    onDestroy(async () => {
        console.log('cleanup inspect');
    });
</script>

<ScrollArea class="p-2 h-full w-full rounded-3xl" orientation="vertical">
    {#if code}
        <div class="px-5 bg-secondary dark:bg-secondary-foreground rounded-2xl w-full">
            {@html code}
        </div>
    {/if}
</ScrollArea>
