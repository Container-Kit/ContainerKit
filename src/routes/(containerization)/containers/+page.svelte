<script lang="ts">
    import type { ContainerClient } from "$lib/models/container";
    import { Command } from "@tauri-apps/plugin-shell";
    import { onMount } from "svelte";
    import ContainerList from "../../(components)/container-list.svelte";
    import { columns } from "../../(components)/columns";

    type ErrorLog = {
        message: string;
        stderr: string;
        stdout: string;
    };

    let allContainers: Array<ContainerClient> = $state([]);
    let runningContainers: Array<ContainerClient> = $state([]);
    let showOnlyRunningContainers = $state(false);
    let error: ErrorLog | null = $state(null);

    async function getAllContainers() {
        const output = await Command.create("container", [
            "ls",
            "-a",
            "--format",
            "json",
        ]).execute();

        if (output.code === null) {
            error = {
                message: "Process was terminated by a signal on Unix",
                stderr: output.stderr,
                stdout: output.stdout,
            };
            return;
        }

        if (!output.stdout) {
            error = {
                message: "No container found",
                stderr: output.stderr,
                stdout: output.stdout,
            };
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
        await getAllContainers();
    });
</script>

<div class="flex flex-1 flex-col">
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ContainerList
                data={showOnlyRunningContainers
                    ? runningContainers
                    : allContainers}
                columns={columns({ getAllContainers })}
                {getAllContainers}
                bind:showOnlyRunningContainers
            />
        </div>
    </div>
</div>
