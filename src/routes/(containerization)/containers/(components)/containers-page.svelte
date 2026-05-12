<script lang="ts" generics="TData, TValue">
    import {
        type ColumnDef,
        type ColumnFiltersState,
        type RowSelectionState,
        type PaginationState,
        type SortingState,
        type VisibilityState,
        getCoreRowModel,
        getFilteredRowModel,
        getPaginationRowModel
    } from '@tanstack/table-core';
    import { createSvelteTable } from '$lib/components/ui/data-table';
    import ContainerToolbar from './container-toolbar.svelte';
    import ContainerTable from './container-table.svelte';

    type DataTableProps<TData, TValue> = {
        columns: ColumnDef<TData, TValue>[];
        data: TData[];
    };

    type Props = {
        showOnlyRunningContainers: boolean;
    };

    let {
        data,
        columns,
        showOnlyRunningContainers = $bindable()
    }: DataTableProps<TData, TValue> & Props = $props();

    let columnFilters = $state<ColumnFiltersState>([]);
    let rowSelection = $state<RowSelectionState>({});
    let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
    let sorting = $state<SortingState>([]);
    let columnVisibility = $state<VisibilityState>({});

    const table = createSvelteTable({
        get data() {
            return data;
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            get columnFilters() {
                return columnFilters;
            },
            get pagination() {
                return pagination;
            },
            get sorting() {
                return sorting;
            },
            get rowSelection() {
                return rowSelection;
            },
            get columnVisibility() {
                return columnVisibility;
            }
        },
        onColumnFiltersChange: (updater) => {
            if (typeof updater === 'function') {
                columnFilters = updater(columnFilters);
            } else {
                columnFilters = updater;
            }
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                pagination = updater(pagination);
            } else {
                pagination = updater;
            }
        },
        onRowSelectionChange: (updater) => {
            if (typeof updater === 'function') {
                rowSelection = updater(rowSelection);
            } else {
                rowSelection = updater;
            }
        },
        onColumnVisibilityChange: (updater) => {
            if (typeof updater === 'function') {
                columnVisibility = updater(columnVisibility);
            } else {
                columnVisibility = updater;
            }
        }
    });
</script>

<div class="space-y-4">
    <ContainerToolbar {table} bind:showOnlyRunningContainers />
    <ContainerTable {table} bind:showOnlyRunningContainers />
</div>
