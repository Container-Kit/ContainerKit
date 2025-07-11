<script lang="ts" generics="TData, TValue">
    import {
        type ColumnDef,
        type ColumnFiltersState,
        getCoreRowModel,
        getFilteredRowModel,
    } from "@tanstack/table-core";
    import {
        createSvelteTable,
        FlexRender,
    } from "$lib/components/ui/data-table/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import Search from "@lucide/svelte/icons/search";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Switch } from "$lib/components/ui/switch/index.js";
    import {PressedKeys} from "runed";

    const keys = new PressedKeys();
    let searchInputBox: HTMLInputElement | null = $state(null);
    let showKeyboardShortcut = $state(true)
    keys.onKeys(["meta", "k"], () => {
        searchInputBox?.focus()
    })

    type DataTableProps<TData, TValue> = {
        columns: ColumnDef<TData, TValue>[];
        data: TData[];
    };

    type Props = {
        showOnlyRunningContainers: boolean;
        getAllContainers: () => Promise<void>;
    };

    let {
        data,
        columns,
        showOnlyRunningContainers = $bindable(),
    }: DataTableProps<TData, TValue> & Props = $props();
    let columnFilters = $state<ColumnFiltersState>([]);

    const table = createSvelteTable({
        get data() {
            return data;
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            get columnFilters() {
                return columnFilters;
            },
        },
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: (updater) => {
            if (typeof updater === "function") {
                columnFilters = updater(columnFilters);
            } else {
                columnFilters = updater;
            }
        },
    });

    let searchValue = $state(
        (table.getColumn("id")?.getFilterValue() as string) ?? "",
    );
</script>

<div class="space-y-4">
    <div class="flex items-center space-x-2">
        <div class="relative flex-1">
            <Search
                class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
            />
            {#if showKeyboardShortcut}
                <kbd class="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span class="text-xs tracking-wider">⌘</span>K
                </kbd>
            {/if}
            <Input
                bind:ref={searchInputBox}
                type="text"
                placeholder="Search containers..."
                bind:value={searchValue}
                oninput={() =>
                    table.getColumn("id")?.setFilterValue(searchValue)}
                onkeydown={(e) => {
                    if (e.key === "Enter") {
                        table.getColumn("id")?.setFilterValue(searchValue);
                    }
                }}
                onfocus={() => showKeyboardShortcut = false}
                onblur={() => showKeyboardShortcut = searchValue?.length === 0}
                class="pl-8 text-pretty"
            />
        </div>
        <div class="flex items-center space-x-2">
            <Switch
                disabled={!showOnlyRunningContainers && data.length === 0}
                id="running-containers-only"
                bind:checked={showOnlyRunningContainers}
            />
            <Label for="running-containers-only">Running Containers Only</Label>
        </div>
    </div>

    <div class="rounded-md border">
        <Table.Root>
            <Table.Header>
                {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                    <Table.Row>
                        {#each headerGroup.headers as header (header.id)}
                            <Table.Head>
                                {#if !header.isPlaceholder}
                                    <FlexRender
                                        content={header.column.columnDef.header}
                                        context={header.getContext()}
                                    />
                                {/if}
                            </Table.Head>
                        {/each}
                    </Table.Row>
                {/each}
            </Table.Header>
            <Table.Body>
                {#each table.getRowModel().rows as row (row.id)}
                    <Table.Row data-state={row.getIsSelected() && "selected"}>
                        {#each row.getVisibleCells() as cell (cell.id)}
                            <Table.Cell>
                                <FlexRender
                                    content={cell.column.columnDef.cell}
                                    context={cell.getContext()}
                                />
                            </Table.Cell>
                        {/each}
                    </Table.Row>
                {:else}
                    <Table.Row>
                        <Table.Cell
                            colspan={columns.length}
                            class="h-24 text-center"
                        >
                            No results.
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>
</div>
