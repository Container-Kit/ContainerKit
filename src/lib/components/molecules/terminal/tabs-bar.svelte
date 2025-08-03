<script lang="ts">
    import TabItem from '$lib/components/atoms/terminal/tab-item.svelte';
    import { Button } from '$lib/components/ui/button';
    import TooltipWrapper from '$lib/components/atoms/tooltip.svelte';
    import { Plus } from '@lucide/svelte';
    import { cn } from '$lib/utils';

    interface TerminalSession {
        id: string;
        title: string;
        active: boolean;
        editing: boolean;
    }

    interface TabsBarProps {
        sessions: TerminalSession[];
        editingValue?: string;
        onTabSelect?: (sessionId: string) => void;
        onTabEdit?: (sessionId: string) => void;
        onTabSave?: (sessionId: string) => void;
        onTabCancel?: (sessionId: string) => void;
        onTabClose?: (sessionId: string) => void;
        onEditValueChange?: (value: string) => void;
        onKeydown?: (event: KeyboardEvent, sessionId: string) => void;
        onNewTab?: () => void;
        class?: string;
    }

    let {
        sessions = [],
        editingValue = '',
        onTabSelect,
        onTabEdit,
        onTabSave,
        onTabCancel,
        onTabClose,
        onEditValueChange,
        onKeydown,
        onNewTab,
        class: className
    }: TabsBarProps = $props();
</script>

{#if sessions.length > 0}
    <div
        class={cn(
            'flex items-center bg-muted/50 border-b border-border overflow-x-auto',
            className
        )}
    >
        {#each sessions as session (session.id)}
            <TabItem
                id={session.id}
                title={session.title}
                active={session.active}
                editing={session.editing}
                {editingValue}
                onSelect={onTabSelect}
                onEdit={onTabEdit}
                onSave={onTabSave}
                onCancel={onTabCancel}
                onClose={onTabClose}
                {onEditValueChange}
                {onKeydown}
            />
        {/each}
        <TooltipWrapper content="New Terminal" delayDuration={300}>
            {#snippet children()}
                <Button
                    variant="ghost"
                    size="sm"
                    class="flex items-center justify-center ml-2 w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-background/50 transition-colors shrink-0"
                    onclick={onNewTab}
                >
                    <Plus size={14} />
                </Button>
            {/snippet}
        </TooltipWrapper>
    </div>
{/if}
