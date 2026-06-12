<script lang="ts" generics="TData, TValue">
    import {
        type ColumnDef,
        type ColumnFiltersState,
        type RowSelectionState,
        type PaginationState,
        type SortingState,
        getCoreRowModel,
        getFilteredRowModel,
        getPaginationRowModel
    } from '@tanstack/table-core';
    import { fade } from 'svelte/transition';
    import { createSvelteTable } from '$lib/components/ui/data-table';
    import DeleteConfirmationDialog from '$lib/components/molecules/delete-confirmation-dialog.svelte';
    import ImageDataTable from './image-data-table.svelte';
    import * as Alert from '$lib/components/ui/alert/index.js';
    import { Button } from '$lib/components/ui/button';
    import Refresh from '@lucide/svelte/icons/rotate-ccw';
    import Search from '@lucide/svelte/icons/search';
    import Import from '@lucide/svelte/icons/import';
    import CloudDownload from '@lucide/svelte/icons/cloud-download';
    import Delete from '@lucide/svelte/icons/trash-2';
    import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
    import { Badge } from '$lib/components/ui/badge/index.js';
    import { getAllContainers } from '$lib/services/containerization/containers';
    import { toast } from 'svelte-sonner';
    import {
        imageReference,
        imageSizeInBytes,
        type ContainerClient,
        type ContainerImage
    } from '$lib/models/container';
    import prettyBytes from 'pretty-bytes';
    import { removeMultipleImages } from '$lib/services/containerization/images';
    import { ConfirmDeleteDialog } from '$lib/components/ui/confirm-delete-dialog';
    import TarFromImage from '../(components)/tar-from-image.svelte';
    import * as Card from '$lib/components/ui/card/index.js';
    import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
    import * as DataTableExtensions from '$lib/components/atoms/data-table-extensions/index.js';

    type DataTableProps<TData, TValue> = {
        columns: ColumnDef<TData, TValue>[];
        data: TData[];
        showPullImageDialog?: boolean;
        showTarImageDialog?: boolean;
    };

    type Props = {} & DataTableProps<TData, TValue>;

    let {
        data,
        columns,
        showPullImageDialog = $bindable(),
        showTarImageDialog = $bindable()
    }: Props = $props();

    let bulkDeleteState = $state({
        showDialog: false,
        imagesInUse: {} as Record<string, string[]>,
        imagesToDelete: [] as string[],
        sizeFreedUp: 0
    });

    let columnFilters = $state<ColumnFiltersState>([]);
    let rowSelection = $state<RowSelectionState>({});
    let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
    let sorting = $state<SortingState>([]);

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
        }
    });

    async function deleteSelectedImages() {
        if (bulkDeleteState.imagesToDelete.length === 0) {
            toast.warning('No images to delete', {
                description: 'All selected images are currently in use by containers.'
            });
            closeDeleteDialog();
            return;
        }

        const result = await removeMultipleImages(bulkDeleteState.imagesToDelete);
        closeDeleteDialog();
        if (!result.ok) {
            toast.error(result.error);
            return;
        }

        toast.success('Selected images deleted successfully', { description: result.data });
        table.resetRowSelection();
    }

    async function startMultipleImagesDelete() {
        const output = await getAllContainers();
        if (!output.ok) {
            toast.error('Error in getting container list', {
                description: output.error
            });
            return;
        }

        const containers: ContainerClient[] = output.data;
        const selectedRowIds = Object.keys(rowSelection);
        const selectedRowsData = selectedRowIds.map(
            (rowId) => table.getRow(rowId).original
        ) as Array<ContainerImage>;
        const imagesInUseMap: Record<string, string[]> = {};
        for (const image of selectedRowsData) {
            const reference = imageReference(image);
            const containersUsingImage = containers.filter(
                (container) => reference === container.configuration.image.reference
            );
            if (containersUsingImage.length > 0) {
                const containerIds = containersUsingImage.map(
                    (container) => container.configuration.id
                );
                imagesInUseMap[reference] = containerIds;
            } else {
                bulkDeleteState.sizeFreedUp += imageSizeInBytes(image) ?? 0;
                bulkDeleteState.imagesToDelete.push(reference);
            }
        }

        bulkDeleteState.imagesInUse = imagesInUseMap;
        bulkDeleteState.showDialog = true;
    }

    function closeDeleteDialog() {
        bulkDeleteState = {
            imagesInUse: {},
            imagesToDelete: [],
            sizeFreedUp: 0,
            showDialog: false
        };
    }
</script>

<div class="space-y-4">
    <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-2">
            <DataTableExtensions.SearchInput
                {table}
                columnToFilter="name"
                placeholder="Search Images..."
            />
            <div class="flex items-center space-x-2">
                <!-- TODO: Implement a dialog to fetch a new image -->
                <Button variant="outline" onclick={() => (showTarImageDialog = true)}>
                    <Import /> Import Image
                </Button>
            </div>
            <div class="flex items-center space-x-2">
                <!-- TODO: Implement a dialog to fetch a new image -->
                <Button variant="outline" onclick={() => (showPullImageDialog = true)}>
                    <CloudDownload />
                    Pull Remote Image
                </Button>
            </div>
        </div>
        <div class="flex items-center space-x-2">
            {#if Object.keys(rowSelection).length > 0}
                <div class="flex relative" transition:fade>
                    <Button class="flex " variant="destructive" onclick={startMultipleImagesDelete}>
                        <Delete />
                        Delete
                    </Button>
                    <Badge
                        variant="destructive"
                        class="absolute -top-3 -right-1.5 rounded-full bg-destructive-foreground! text-destructive!"
                    >
                        {@const totalSelectedRows = Object.keys(rowSelection).length}
                        {#if totalSelectedRows !== data.length}
                            {totalSelectedRows}
                        {:else}
                            All
                        {/if}
                    </Badge>
                </div>
            {/if}
            <DataTableExtensions.ViewOptions {table} />
        </div>
    </div>

    <div class="flex flex-col space-y-2">
        <div class="rounded-md border">
            <ImageDataTable {table} {columns} />
        </div>
        <DataTableExtensions.Pagination {table} />
    </div>
</div>

<DeleteConfirmationDialog
    bind:open={bulkDeleteState.showDialog}
    title="Delete Selected Images?"
    description="This action cannot be undone. This will permanently delete the selected container images."
    deleteAction={deleteSelectedImages}
    onClose={closeDeleteDialog}
>
    <Card.Root class="@container/card">
        <Card.Header>
            <Card.Description>Total space to be freed up</Card.Description>
            <Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {prettyBytes(bulkDeleteState.sizeFreedUp)}
            </Card.Title>
            <Card.Description>
                You are about to delete {bulkDeleteState.imagesToDelete.length} image(s)
                {#if Object.keys(bulkDeleteState.imagesInUse).length > 0}
                    out of selected {Object.keys(rowSelection).length} image(s) as the rest are currently
                    in use by containers.
                {/if}
            </Card.Description>
        </Card.Header>
    </Card.Root>
    {#if Object.keys(bulkDeleteState.imagesInUse).length > 0}
        <Alert.Root variant="destructive" class="mb-4">
            <Alert.Title class="flex flex-row items-center gap-1.5 text-lg">
                <AlertCircleIcon class="size-4" /> Deletion Blocked for Some Images
            </Alert.Title>
            <Alert.Description>
                The following images cannot be deleted as they are currently in use by one or more
                containers:
                <ul class="list-inside list-disc mt-2 space-y-1">
                    {#each Object.keys(bulkDeleteState.imagesInUse) as reference (reference)}
                        <li>
                            <span class="font-semibold">{reference.split('/').at(-1)}</span> is in
                            use by container(s):
                            <span class="font-semibold"
                                >{bulkDeleteState.imagesInUse[reference].join(', ')}</span
                            >
                        </li>
                    {/each}
                </ul>
                <p class="font-semibold tracking-wider mt-2">
                    To delete these images, you must first remove the containers that depend on
                    them.
                </p>
            </Alert.Description>
        </Alert.Root>
    {/if}
</DeleteConfirmationDialog>

<ConfirmDeleteDialog />
<TarFromImage />
