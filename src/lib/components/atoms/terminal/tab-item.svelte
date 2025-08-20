<script lang="ts">
    import { Input } from '$lib/components/ui/input';
    import TooltipWrapper from '$lib/components/atoms/tooltip.svelte';
    import { Edit, X, Check } from '@lucide/svelte';
    import { cn } from '$lib/utils';
    import { slide } from 'svelte/transition';

    interface TabItemProps {
        id: string;
        title: string;
        active?: boolean;
        editing?: boolean;
        editingValue?: string;
        onSelect?: (id: string) => void;
        onEdit?: (id: string) => void;
        onSave?: (id: string) => void;
        onCancel?: (id: string) => void;
        onClose?: (id: string) => void;
        onEditValueChange?: (value: string) => void;
        onKeydown?: (event: KeyboardEvent, id: string) => void;
        class?: string;
    }

    let {
        id,
        title,
        active = false,
        editing = false,
        editingValue = '',
        onSelect,
        onEdit,
        onSave,
        onCancel,
        onClose,
        onEditValueChange,
        onKeydown,
        class: className
    }: TabItemProps = $props();

    function handleClick() {
        if (!editing) {
            onSelect?.(id);
        }
    }

    function handleEditClick(event: MouseEvent) {
        event.stopPropagation();
        onEdit?.(id);
    }

    function handleSaveClick(event: MouseEvent) {
        event.stopPropagation();
        onSave?.(id);
    }

    function handleCancelClick(event: MouseEvent) {
        event.stopPropagation();
        onCancel?.(id);
    }

    function handleCloseClick(event: MouseEvent) {
        event.stopPropagation();
        onClose?.(id);
    }

    function handleInputKeydown(event: KeyboardEvent) {
        onKeydown?.(event, id);
    }

    function handleInputBlur() {
        onSave?.(id);
    }

    function handleInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        onEditValueChange?.(target.value);
    }


</script>

<div transition:slide={{axis: 'x'}}
    class={cn(
        'group flex items-center gap-2 px-3 py-2 text-sm border-r border-border transition-colors whitespace-nowrap cursor-pointer min-h-[40px]',
        active
            ? 'bg-secondary text-secondary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
        className
    )}
    onclick={handleClick}
    onkeydown={() => {}}
    role="tab"
    tabindex="0"
    aria-selected={active}
>
    {#if editing}
        <div class="flex items-center gap-1 py-1" role="button" tabindex="0" onkeydown={() => {}} onclick={(e) => e.stopPropagation()}>
            <Input
                value={editingValue}
                class="h-6 px-2 py-0 text-xs w-24 focus:w-32 transition-all"
                onkeydown={handleInputKeydown}
                onblur={handleInputBlur}
                oninput={handleInputChange}
                autofocus
            />
            <TooltipWrapper content="Save">
                {#snippet children()}
                    <button
                        class="w-4 h-4 rounded-sm hover:bg-green-500/20 flex items-center justify-center cursor-pointer text-green-600"
                        onclick={handleSaveClick}
                        role="button"
                        tabindex="0"
                    >
                        <Check size={10} />
                    </button>
                {/snippet}
            </TooltipWrapper>
            <TooltipWrapper content="Cancel">
                {#snippet children()}
                    <div
                        class="w-4 h-4 rounded-sm hover:bg-muted-foreground/20 flex items-center justify-center cursor-pointer"
                        onclick={handleCancelClick}
                        role="button"
                        tabindex="0"
                    >
                        <X size={10} />
                    </div>
                {/snippet}
            </TooltipWrapper>
        </div>
    {:else}
        <span class="cursor-pointer py-1">{title}</span>
        <div class="flex items-center gap-1">
            <TooltipWrapper content="Rename Session">
                {#snippet children()}
                    <div
                        class="w-4 h-4 rounded-sm hover:bg-muted-foreground/20 flex items-center justify-center cursor-pointer transition-opacity"
                        onclick={handleEditClick}
                        role="button"
                        tabindex="0"
                    >
                        <Edit size={10} />
                    </div>
                {/snippet}
            </TooltipWrapper>
            <TooltipWrapper content="Close Session">
                {#snippet children()}
                    <div
                        class="w-4 h-4 rounded-sm hover:bg-muted-foreground/20 flex items-center justify-center cursor-pointer"
                        onclick={handleCloseClick}
                        role="button"
                        tabindex="0"
                    >
                        <X size={10} />
                    </div>
                {/snippet}
            </TooltipWrapper>
        </div>
    {/if}
</div>
