<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import SessionBadge from '$lib/components/atoms/terminal/session-badge.svelte';
    import { Terminal as TerminalIcon } from '@lucide/svelte';
    import { cn } from '$lib/utils';
    import { getVersion } from '@tauri-apps/api/app';
    import { onMount } from 'svelte';

    interface TerminalFooterProps {
        isOpen?: boolean;
        isMinimized?: boolean;
        sessionCount?: number;
        onToggle?: () => void;
        class?: string;
    }

    let {
        isOpen = false,
        isMinimized = false,
        sessionCount = 0,
        onToggle,
        class: className
    }: TerminalFooterProps = $props();

    let version = $state('0.0.0')

    onMount(async () => {
        version = await getVersion()
    })
</script>

<div
    class={cn(
        'flex flex-row items-center gap-x-2 bg-card px-4 py-2 border border-border transition-all duration-300',
        isOpen && !isMinimized ? 'rounded-b-xl border-t-0' : 'rounded-xl',
        className
    )}
>
    <Button
        variant="ghost"
        class="rounded-xl gap-2 text-muted-foreground hover:text-foreground hover:bg-muted"
        onclick={onToggle}
    >
        <TerminalIcon size={16} />
        Terminal
        <SessionBadge count={sessionCount} />
    </Button>

    <div class="flex-1"></div>

    <div class="flex items-center gap-4 text-xs text-muted-foreground">
        <span>ContainerKit v{version}</span>
        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Connected"></div>
    </div>
</div>
