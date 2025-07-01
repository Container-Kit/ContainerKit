import type { ColumnDef } from "@tanstack/table-core";
import type { ContainerClient } from "$lib/models/container";
import { renderComponent } from "$lib/components/ui/data-table/index.js";

import ContainerStatus from "./container-status.svelte";
import ContainerListActions from "./container-list-actions.svelte";

type ContainerColumnProps = {
  getAllContainers: () => Promise<void>;
};

export function columns({
  getAllContainers,
}: ContainerColumnProps): ColumnDef<ContainerClient>[] {
  return [
    {
      id: "id",
      header: "ID",
      accessorFn: (row) => row.configuration.id,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as ContainerClient["status"];
        return renderComponent(ContainerStatus, { status });
      },
    },
    {
      id: "image",
      header: "Image",
      accessorFn: (row) =>
        row.configuration.image.reference?.split("/")?.at(-1) ?? "N/A",
    },
    {
      id: "host",
      header: "Host",
      accessorFn: (row) =>
        `${row.configuration.hostname}.${row.configuration.dns.domain}`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as ContainerClient["configuration"]["id"];
        const status = row.getValue("status") as ContainerClient["status"];
        return renderComponent(ContainerListActions, {
          status,
          id,
          getAllContainers,
        });
      },
    },
  ];
}
