<script lang="ts">
    import CirclePlay from "@lucide/svelte/icons/circle-play";
    import CircleStop from "@lucide/svelte/icons/circle-stop";
    import Delete from "@lucide/svelte/icons/trash-2";
    import Loader from "@lucide/svelte/icons/loader";
    import { toast } from "svelte-sonner";

    import type { ContainerClient } from "$lib/models/container";

    import { Button } from "$lib/components/ui/button";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import {
        startContainer,
        stopContainer,
    } from "$lib/services/containerization/containers";

    type Props = {
        status: ContainerClient["status"];
        id: string;
        getAllContainerList: () => Promise<void>;
    };


    let { status, id, getAllContainerList }: Props = $props();

    let disableActions = $state(false)
    let startingContainer = $state(false)

    async function handleContainerRunningState() {
        startingContainer = disableActions = true
        const message = status === "running" ? "stopped" : "started";
        const output =
            status === "running"
                ? await stopContainer(id)
                : await startContainer(id);
        await getAllContainerList();
        startingContainer = disableActions = false
        if (output.error) {
            toast.error(output.message);
            console.error(output);
            return;
        }

        if (output.stdout && !output.error) {
            toast.success(`Container ${output.stdout} ${message} successfully`);
        }
    }
</script>

<div class="flex items-center h-full">
    <Tooltip.Provider delayDuration={150}>
        <Tooltip.Root>
            <Tooltip.Trigger>
                {#snippet child({ props })}
                    <Button
                        {...props}
                        variant="ghost"
                        size="icon"
                        onclick={handleContainerRunningState}
                        class={[
                            status === "running"
                                ? "text-red-400 hover:bg-red-100 hover:text-red-400"
                                : "text-green-400",
                        ]}
                        disabled={disableActions}
                    >
                        {#if status === "running"}
                            <CircleStop />
                        {:else if startingContainer}
                            <Loader class="animate-spin"/>
                        {:else}
                            <CirclePlay />
                        {/if}
                    </Button>
                {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content side="left">
                <p>{status === "running" ? "Stop" : "Start"}</p>
            </Tooltip.Content>
        </Tooltip.Root>
    </Tooltip.Provider>

    <Separator orientation="vertical" class="h-5" />

    <Tooltip.Provider delayDuration={10}>
        <Tooltip.Root>
            <Tooltip.Trigger class="bg-destructive">
                {#snippet child({ props })}
                    <Button
                        {...props}
                        variant="ghost"
                        size="icon"
                        class="text-red-400 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-100"
                        disabled={disableActions}
                    >
                        <Delete />
                    </Button>
                {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content side="right" class="bg-destructive text-foreground" arrowClasses="bg-destructive">
                <p>Delete</p>
            </Tooltip.Content>
        </Tooltip.Root>
    </Tooltip.Provider>
</div>
