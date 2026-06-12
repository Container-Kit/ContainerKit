import type { ColumnDef } from '@tanstack/table-core';

import type { ContainerClient, ContainerState } from '$lib/models/container';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import {
    DataTableCheckbox,
    DataTableFeaturedTextCell
} from '$lib/components/atoms/data-table-extensions/index.js';

import ContainerStatus from './container-status.svelte';
import ContainerActions from './container-actions.svelte';
import ContainerLastStarted from './container-last-started.svelte';

type ContainerColumnProps = {
    deleteContainer: (id: string) => Promise<void>;
};

export function columns({ deleteContainer }: ContainerColumnProps): ColumnDef<ContainerClient>[] {
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
                return renderComponent(DataTableFeaturedTextCell, {
                    content: row.getValue<string>('id'),
                    tooltip: row.original.configuration.id,
                    href: '/containers/' + row.original.configuration.id,
                    copyFirst: true
                })
            },
            enableHiding: false
        },
        {
            id: 'status',
            accessorFn: (row) => row.status.state,
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as ContainerState;
                return renderComponent(ContainerStatus, { status });
            },
            enableHiding: false
        },
        {
            id: 'image',
            header: 'Image',
            accessorFn: (row) => row.configuration.image.reference?.split('/')?.at(-1) ?? 'N/A',
            enableHiding: false
        },
        {
            id: 'host',
            header: 'Host',
            accessorFn: (row) => {
                const { state, networks } = row.status;
                if (state === 'stopped' || !networks.length) {
                    return 'N/A';
                }

                const hostnames = networks
                    .map((network) => network.hostname)
                    .filter(Boolean);
                return hostnames.length > 0 ? hostnames.at(0)?.endsWith('.') ? hostnames.at(0)?.slice(0, -1) : hostnames.at(0): 'N/A';
            },
            cell: ({ row }) => {
                const content = row.getValue<string>('host');
                return renderComponent(DataTableFeaturedTextCell, {
                    content: content,
                    tooltip: content === 'N/A' ? '' : content,
                    copy: content !== 'N/A'
                })
            }
        },
        {
            id: 'network',
            header: 'Network',
            enableHiding: true,
            accessorFn: (row) =>{
                const { state, networks } = row.status;
                if (state === 'stopped' || !networks.length) {
                    return 'N/A';
                }

                const IPv4Addresses = networks
                    .map((network) => network.ipv4Address?.split('/')?.[0])
                    .filter(Boolean);

                return IPv4Addresses.length > 0 ? IPv4Addresses.at(0) : 'N/A';
            },
            cell: ({ row }) => {
                const content = row.getValue<string>('network');
                return renderComponent(DataTableFeaturedTextCell, {
                    content: content,
                    tooltip: content,
                    copy: content !== 'N/A'
                });
            }
        },
        {
            id: 'lastStarted',
            header: 'Last Started',
            accessorFn: (row) => row.status.startedDate,
            cell: ({ row }) => {
                return renderComponent(ContainerLastStarted, {
                    lastStarted: row.original.status.startedDate
                });
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const id = row.getValue('id') as ContainerClient['configuration']['id'];
                const status = row.getValue('status') as ContainerState;
                return renderComponent(ContainerActions, {
                    status,
                    id,
                    deleteContainer
                });
            },
            enableHiding: false
        }
    ];
}
