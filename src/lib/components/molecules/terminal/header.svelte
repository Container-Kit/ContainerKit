<script lang="ts">
    import TrafficLights from '$lib/components/atoms/terminal/traffic-lights.svelte';
    import HeaderIcon from '$lib/components/atoms/terminal/header-icon.svelte';
    import TabControls from '$lib/components/atoms/terminal/tab-controls.svelte';
    import { cn } from '$lib/utils';

    interface TerminalHeaderProps {
        title?: string;
        onClose?: () => void;
        onMinimize?: () => void;
        onMaximize?: () => void;
        onNewTab?: () => void;
        class?: string;
    }

    let {
        title = 'Terminal',
        onClose,
        onMinimize,
        onMaximize,
        onNewTab,
        class: className
    }: TerminalHeaderProps = $props();
</script>

<div class={cn('flex items-center justify-between bg-muted px-4 py-2 border-b border-border', className)}>
    <div class="flex items-center gap-3">
        <TrafficLights {onClose} {onMinimize} onMaximize={onMaximize} />
        <HeaderIcon {title} />
    </div>

    <TabControls {onNewTab} onMinimize={onMinimize} onClose={onClose} />
</div>
