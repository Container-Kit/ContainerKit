import type { ColumnDef } from '@tanstack/table-core';
import type { ContainerImage } from '$lib/models/container';
import { renderComponent } from '$lib/components/ui/data-table';
import DataTableCheckbox from '$lib/components/atoms/data-table-checkbox.svelte';
import ImageListActions from './image-list-actions.svelte';
import ImageCellWithTooltip from './image-list-cell-with-tooltip.svelte';

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
                return renderComponent(ImageCellWithTooltip, {
                    content: row.getValue<string>('name'),
                    tooltip: row.original.reference.split(':').at(0) || 'N/A'
                });
            },
            accessorFn: (row) => row.reference?.split('/').at(-1)?.split(':').at(0)
        },
        {
            id: 'tag',
            header: 'Tag',
            accessorFn: (row) => row.reference?.split('/')?.at(-1)?.split(':')?.at(-1) ?? 'N/A'
        },
        {
            id: 'registry',
            header: 'Registry',
            accessorFn: (row) => {
                const reference = row.reference
                const rowData = reference.split('/');
                if (!rowData.length) return reference;
                if (reference?.startsWith('http')) {
                    return rowData.at(2) || 'N/A';
                }
                return rowData.at(0) || 'N/A';
            },
            cell: ({ row }) => {
                return renderComponent(ImageCellWithTooltip, {
                    content: row.getValue<string>('registry'),
                    tooltip: row.original.reference,
                    copy: true
                });
            }
        },
        {
            id: 'size',
            header: 'Size',
            accessorFn: (row) => row.fullSize ?? 'N/A'
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                return renderComponent(ImageListActions, {
                    name: row.getValue<string>('name'),
                    reference: row.original.reference
                });
            }
        }
    ];
}
