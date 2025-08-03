<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import TooltipWrapper from '$lib/components/atoms/tooltip.svelte';
    import { Plus, Minimize2, X } from '@lucide/svelte';
    import { cn } from '$lib/utils';

    interface TabControlsProps {
        onNewTab?: () => void;
        onMinimize?: () => void;
        onClose?: () => void;
        class?: string;
    }

    let { onNewTab, onMinimize, onClose, class: className }: TabControlsProps = $props();
</script>

<div class={cn('flex items-center gap-2', className)}>
    <TooltipWrapper content="New Terminal">
        {#snippet children()}
            <Button
                variant="ghost"
                size="sm"
                class="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onclick={onNewTab}
            >
                <Plus size={12} />
            </Button>
        {/snippet}
    </TooltipWrapper>

    <TooltipWrapper content="Minimize">
        {#snippet children()}
            <Button
                variant="ghost"
                size="sm"
                class="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onclick={onMinimize}
            >
                <Minimize2 size={12} />
            </Button>
        {/snippet}
    </TooltipWrapper>

    <TooltipWrapper content="Close">
        {#snippet children()}
            <Button
                variant="ghost"
                size="sm"
                class="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onclick={onClose}
            >
                <X size={12} />
            </Button>
        {/snippet}
    </TooltipWrapper>
</div>
