<script lang="ts" generics="TData">
    import type { Table } from '@tanstack/table-core';
    import * as DataTableExtensions from '$lib/components/atoms/data-table-extensions/index.js';
    import { Switch } from '$lib/components/ui/switch';
    import { Label } from '$lib/components/ui/label';
    import { fade } from 'svelte/transition';
    import { Button } from '$lib/components/ui/button';
    import Delete from '@lucide/svelte/icons/trash-2';

    let {
        table,
        showOnlyRunningContainers = $bindable(false)
    }: { table: Table<TData>; showOnlyRunningContainers: boolean } = $props();

    function startMultipleContainerDelete() {
        // const selectedRowIds = Object.keys(table?._getSortedRowModel?.());
        // console.log('Starting delete for containers with IDs:', selectedRowIds);
        // Implement the logic to delete multiple containers based on selectedRowIds
    }
</script>

<div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
        <DataTableExtensions.SearchInput
            {table}
            columnToFilter="id"
            placeholder="Search container..."
        />
        <div class="flex items-center space-x-2">
            <Label for="running-containers-only">Running Containers Only</Label>
            <Switch
                disabled={!showOnlyRunningContainers && table.getRowCount() === 0}
                id="running-containers-only"
                bind:checked={showOnlyRunningContainers}
            />
        </div>
    </div>
    <div class="flex flex-row items-center gap-x-4">
        {#if table.getIsSomeRowsSelected()}
            <div class="flex relative" transition:fade>
                <Button class="flex " variant="destructive" onclick={startMultipleContainerDelete}>
                    <Delete />
                    Delete
                </Button>
            </div>
        {/if}
        <DataTableExtensions.ViewOptions {table} />
    </div>
</div>
