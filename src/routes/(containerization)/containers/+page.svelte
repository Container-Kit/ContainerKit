<script lang="ts">
    import type { ContainerClient } from "$lib/models/container";
    import { onMount } from "svelte";
    import ContainerList from "../../(components)/container-list.svelte";
    import { columns } from "../../(components)/columns";
    import {getAllContainers} from "$lib/services/containerization/containers";

    type ErrorLog = {
        message: string;
        stderr: string;
        stdout: string;
    };

    let allContainers: Array<ContainerClient> = $state([]);
    let runningContainers: Array<ContainerClient> = $state([]);
    let showOnlyRunningContainers = $state(false);
    let error: ErrorLog | null = $state(null);

    async function getAllContainerList() {
        const output = await getAllContainers()

        if (output.error) {
            error = output;
            return;
        }

        if (!output.stdout) {
            error = output;
            return;
        }

        const containers = JSON.parse(output.stdout) ?? [];
        allContainers = containers;
        if (allContainers.length > 0) {
            runningContainers = containers.filter(
                (container: ContainerClient) => container.status === "running",
            );
        }
    }

    onMount(async () => {
        await getAllContainerList();
    });
</script>

<div class="flex flex-1 flex-col">
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ContainerList
                data={showOnlyRunningContainers
                    ? runningContainers
                    : allContainers}
                columns={columns({ getAllContainerList })}
                getAllContainers={getAllContainerList}
                bind:showOnlyRunningContainers
            />
        </div>
    </div>
</div>
