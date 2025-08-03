<script lang="ts">
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { cn } from '$lib/utils';

    interface TooltipWrapperProps {
        /** The tooltip content text */
        content: string;
        /** Delay before showing tooltip in milliseconds */
        delayDuration?: number;
        /** Whether to disable the tooltip */
        disabled?: boolean;
        /** Tooltip position side */
        side?: 'top' | 'bottom' | 'left' | 'right';
        /** Distance from trigger in pixels */
        sideOffset?: number;
        /** Alignment of tooltip relative to trigger */
        align?: 'start' | 'center' | 'end';
        /** Custom class for tooltip content */
        contentClass?: string;
        /** Custom class for arrow */
        arrowClass?: string;
        /** Whether to show arrow */
        arrow?: boolean;
        /** Children content */
        children?: import('svelte').Snippet;
    }

    let {
        content,
        delayDuration = 1000,
        disabled = false,
        side = 'top',
        sideOffset = 4,
        align = 'center',
        contentClass,
        arrowClass,
        arrow = true,
        children
    }: TooltipWrapperProps = $props();

    // Don't render tooltip if disabled or no content
    let shouldRender = $derived(!disabled && content?.trim());
</script>

{#if shouldRender}
    <Tooltip.Root {delayDuration}>
        <Tooltip.Trigger>
            {@render children?.()}
        </Tooltip.Trigger>
        <Tooltip.Content
            {side}
            {sideOffset}
            {align}
            class={contentClass}
            arrowClasses={cn('bg-primary', arrowClass)}
        >
            {content}
        </Tooltip.Content>
    </Tooltip.Root>
{:else}
    {@render children?.()}
{/if}
