<script lang="ts">
    import Tooltip from "$lib/components/molecules/tooltip.svelte"
    import { CopyButton } from '$lib/components/ui/copy-button/index.js';

    type Props = {
        content: string
        tooltip: string
        copy?: boolean
        copyFirst?: boolean
        href?: string
    }

    const {content, tooltip, copy = false, copyFirst = false, href}: Props = $props()
</script>

<Tooltip contentClass="flex flex-row items-center gap-x-2 w-full" arrow={true} delayDuration={300} content={tooltip} side="top">
    <div class="flex flex-row items-center gap-x-2 w-full">
        {#if href}
            <a {href} class={[copyFirst && 'order-2', 'max-w-fit truncate']}>{content}</a>
        {:else }
            <span class={[copyFirst && 'order-2', 'max-w-fit truncate']}>{content}</span>
        {/if}
        {#if copy || copyFirst}
            <CopyButton variant="ghost" size="sm" class={[copyFirst && '-ml-11', 'has-[>svg]:w-5 has-[>svg]:h-5']} text={tooltip} />
        {/if}
    </div>
</Tooltip>