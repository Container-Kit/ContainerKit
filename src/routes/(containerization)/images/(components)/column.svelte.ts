import type { ColumnDef } from '@tanstack/table-core';
import { imageReference, imageSizeInBytes, type ContainerImage } from '$lib/models/container';
import { renderComponent } from '$lib/components/ui/data-table';
import prettyBytes from 'pretty-bytes';
import { DataTableCheckbox, DataTableFeaturedTextCell } from '$lib/components/atoms/data-table-extensions/index.js';
import ImageListActions from './image-list-actions.svelte';

export function columns(): ColumnDef<ContainerImage>[] {
    return [
        {
            id: 'select',
            header: ({ table }) =>
                renderComponent(DataTableCheckbox, {
                    checked: table.getIsAllPageRowsSelected(),
                    indeterminate:
                        table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
                    onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
                    'aria-label': 'Select all'
                }),
            cell: ({ row }) =>
                renderComponent(DataTableCheckbox, {
                    checked: row.getIsSelected(),
                    onCheckedChange: (value) => row.toggleSelected(!!value),
                    'aria-label': 'Select row'
                }),
            enableSorting: false,
            enableHiding: false
        },
        {
            id: 'name',
            header: 'Name',
            cell: ({ row }) => {
                return renderComponent(DataTableFeaturedTextCell, {
                    content: row.getValue<string>('name'),
                    tooltip: imageReference(row.original).split(':').at(0) || 'N/A',
                    href: '/images/' + imageReference(row.original).split('/').at(-1)
                });
            },
            accessorFn: (row) => imageReference(row).split('/').at(-1)?.split(':').at(0)
        },
        {
            id: 'tag',
            header: 'Tag',
            accessorFn: (row) => imageReference(row).split('/').at(-1)?.split(':').at(-1) ?? 'N/A'
        },
        {
            id: 'registry',
            header: 'Registry',
            accessorFn: (row) => {
                const reference = imageReference(row);
                const rowData = reference.split('/');
                if (!rowData.length) return reference;
                if (reference?.startsWith('http')) {
                    return rowData.at(2) || 'N/A';
                }
                return rowData.at(0) || 'N/A';
            },
            cell: ({ row }) => {
                return renderComponent(DataTableFeaturedTextCell, {
                    content: row.getValue<string>('registry'),
                    tooltip: imageReference(row.original),
                    copy: true
                });
            }
        },
        {
            id: 'size',
            header: 'Size',
            accessorFn: (row) => {
                const size = imageSizeInBytes(row);
                return size != null ? prettyBytes(size) : 'N/A';
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                return renderComponent(ImageListActions, {
                    name: row.getValue<string>('name'),
                    reference: imageReference(row.original)
                });
            }
        }
    ];
}
