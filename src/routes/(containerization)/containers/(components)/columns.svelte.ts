import type { ColumnDef } from '@tanstack/table-core';
import type { ContainerClient } from '$lib/models/container';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import DataTableCheckbox from '$lib/components/atoms/data-table-checkbox.svelte';

import ContainerStatus from './container-status.svelte';
import ContainerListActions from './container-list-actions.svelte';
import { createRawSnippet } from 'svelte';

type ContainerColumnProps = {
    getAllContainerList: () => Promise<void>;
    deleteContainer: (id: string) => Promise<void>;
};

export function columns({
    getAllContainerList,
    deleteContainer
}: ContainerColumnProps): ColumnDef<ContainerClient>[] {
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
            id: 'id',
            header: 'ID',
            accessorFn: (row) => row.configuration.id,
            cell: ({ row }) => {
                const idSnippet = createRawSnippet<[string]>((getId) => {
                    const status = getId();
                    return {
                        render: () => `<p class="w-full">${status}</p>`
                    };
                });
                return renderSnippet(idSnippet, row.getValue('id'));
            }
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as ContainerClient['status'];
                return renderComponent(ContainerStatus, { status });
            }
        },
        {
            id: 'image',
            header: 'Image',
            accessorFn: (row) => row.configuration.image.reference?.split('/')?.at(-1) ?? 'N/A'
        },
        {
            id: 'host',
            header: 'Host',
            accessorFn: (row) =>
                `${row.configuration.hostname}${row.configuration?.dns?.domain === null || row.configuration?.dns?.domain === undefined ? '' : `.${row.configuration.dns.domain}`}`
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const id = row.getValue('id') as ContainerClient['configuration']['id'];
                const status = row.getValue('status') as ContainerClient['status'];
                return renderComponent(ContainerListActions, {
                    status,
                    id,
                    getAllContainerList,
                    deleteContainer
                });
            }
        }
    ];
}
