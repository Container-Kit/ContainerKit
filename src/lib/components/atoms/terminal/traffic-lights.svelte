<script lang="ts">
    import { cn } from '$lib/utils';
    import TooltipWrapper from '$lib/components/atoms/tooltip.svelte';

    interface TrafficLightsProps {
        onClose?: () => void;
        onMinimize?: () => void;
        onMaximize?: () => void;
        class?: string;
    }

    let { onClose, onMinimize, onMaximize, class: className }: TrafficLightsProps = $props();
</script>

<div class={cn('flex items-center gap-2', className)}>
    <TooltipWrapper content="Close">
        {#snippet children()}
            <div
                class="w-3 h-3 bg-destructive rounded-full hover:bg-destructive/80 transition-colors cursor-pointer"
                onclick={onClose}
                role="button"
                tabindex="0"
                onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClose?.();
                    }
                }}
            ></div>
        {/snippet}
    </TooltipWrapper>

    <TooltipWrapper content="Minimize">
        {#snippet children()}
            <div
                class="w-3 h-3 bg-yellow-500 dark:bg-yellow-600 rounded-full hover:bg-yellow-400 dark:hover:bg-yellow-500 transition-colors cursor-pointer"
                onclick={onMinimize}
                role="button"
                tabindex="0"
                onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onMinimize?.();
                    }
                }}
            ></div>
        {/snippet}
    </TooltipWrapper>

    <TooltipWrapper content="Maximize">
        {#snippet children()}
            <div
                class="w-3 h-3 bg-emerald-500 dark:bg-emerald-600 rounded-full hover:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors cursor-pointer"
                onclick={onMaximize}
                role="button"
                tabindex="0"
                onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onMaximize?.();
                    }
                }}
            ></div>
        {/snippet}
    </TooltipWrapper>
</div>
