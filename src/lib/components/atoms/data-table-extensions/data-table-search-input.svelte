<script lang="ts" generics="TData">
    import { slide } from 'svelte/transition';
    import { PressedKeys } from 'runed';
    import { Input } from '$lib/components/ui/input';
    import Search from '@lucide/svelte/icons/search';
    import type { Table } from '@tanstack/table-core';

    type GenericTable = Table<TData>;
    type ColumnToFilter = ReturnType<typeof table.getAllColumns>[number]['id']

    let { table, columnToFilter, placeholder = 'Search...' }: { table: Table<TData>, columnToFilter: ColumnToFilter, placeholder: string} = $props();
    let searchInputBox: HTMLInputElement | null = $state(null);
    let showKeyboardShortcut = $state(true);

    const keys = new PressedKeys();
    keys.onKeys(['meta', 'k'], () => {
        searchInputBox?.focus();
    });
</script>

<div class="relative">
    <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
    {#if showKeyboardShortcut}
        <kbd transition:slide={{axis: 'x'}}
             class="pointer-events-none absolute right-2.5 top-2 hidden h-5 select-none items-center gap-1 rounded-xl border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
        >
            <span class="text-xs tracking-wider">⌘</span>K
        </kbd>
    {/if}
    <Input
        bind:ref={searchInputBox}
        type="text"
        { placeholder }
        value={(table.getColumn(columnToFilter)?.getFilterValue()) ?? ""}
        oninput={(e) => {
				    table.getColumn(columnToFilter)?.setFilterValue(e.currentTarget.value);
			    }}
        onkeydown={(e) => {
                    if (e.key === 'Enter') {
                        table.getColumn(columnToFilter)?.setFilterValue(e.currentTarget.value);
                    }
                    if (e.key === 'Escape') {
                        searchInputBox?.blur()
                    }
                }}
        onfocus={() => (showKeyboardShortcut = false)}
        onblur={(e) => (showKeyboardShortcut = e.currentTarget.value?.length === 0)}
        class="pl-8 text-pretty"
    />
</div>