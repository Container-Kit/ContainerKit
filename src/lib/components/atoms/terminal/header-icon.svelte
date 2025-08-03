<script lang="ts">
    import { Terminal as TerminalIcon } from '@lucide/svelte';
    import { cn } from '$lib/utils';

    interface HeaderIconProps {
        title?: string;
        size?: number;
        class?: string;
    }

    let { title = 'Terminal', size = 16, class: className }: HeaderIconProps = $props();
</script>

<div class={cn('flex items-center gap-2', className)}>
    <TerminalIcon {size} class="text-primary" />
    <span class="text-sm font-medium text-foreground">{title}</span>
</div>
