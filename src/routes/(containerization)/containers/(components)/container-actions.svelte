<script lang="ts">
    import CirclePlay from '@lucide/svelte/icons/circle-play';
    import CircleStop from '@lucide/svelte/icons/circle-stop';
    import Delete from '@lucide/svelte/icons/trash-2';
    import Loader from '@lucide/svelte/icons/loader';
    import Information from '@lucide/svelte/icons/sliders-horizontal';

    import { toast } from 'svelte-sonner';

    import type { ContainerClient } from '$lib/models/container';

    import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
    import { Button } from '$lib/components/ui/button';
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { Separator } from '$lib/components/ui/separator';
    import { startContainer, stopContainer } from '$lib/services/containerization/containers';
    import ContainerDeleteDialog from './container-delete-dialog.svelte';
    import InformationDrawer from './information-drawer.svelte';

    type Props = {
        status: ContainerClient['status'];
        id: string;
        deleteContainer: (id: string) => Promise<void>;
    };

    type ActionState = {
        loadingStatus: ContainerClient['status'] | null;
        disableActions: boolean;
        showDeleteDialog: boolean;
    };

    let { status, id, deleteContainer }: Props = $props();

    let actionState = $state<ActionState>({
        loadingStatus: null,
        disableActions: false,
        showDeleteDialog: false
    });

    let showInformationDrawer = $state(false);

    async function handleContainerRunningState() {
        actionState.loadingStatus = status;
        actionState.disableActions = true;
        const message = status === 'running' ? 'stopped' : 'started';
        const output = status === 'running' ? await stopContainer(id) : await startContainer(id);
        actionState.disableActions = false;
        actionState.loadingStatus = null;
        if (output.error) {
            return toast.error(output.stderr);
        }

        if (output.stdout && !output.error) {
            status = status === 'running' ? 'stopped' : 'running';
            return toast.success(`Container ${output.stdout} ${message} successfully`);
        }
    }

    function handleDeleteContainer() {
        deleteContainer(id);
        actionState.showDeleteDialog = false;
    }

    function handleShowInformationDrawer() {
        showInformationDrawer = true;
    }
</script>

<div class="flex items-center h-full">
    <ButtonGroup.Root>
        <Tooltip.Provider delayDuration={150}>
            <Tooltip.Root>
                <Tooltip.Trigger>
                    {#snippet child({ props })}
                        <Button
                            {...props}
                            variant="outline"
                            size="icon"
                            onclick={handleContainerRunningState}
                            class={[
                                status === 'stopped'
                                    ? 'text-green-400'
                                    : 'text-red-400 hover:bg-red-100 hover:text-red-400'
                            ]}
                            disabled={actionState.disableActions}
                        >
                            {#if actionState.loadingStatus === 'stopped'}
                                <Loader class="animate-spin" />
                            {:else if actionState.loadingStatus === 'running'}
                                <Loader class="animate-spin text-destructive" />
                            {:else if status === 'running'}
                                <CircleStop />
                            {:else}
                                <CirclePlay />
                            {/if}
                        </Button>
                    {/snippet}
                </Tooltip.Trigger>
                <Tooltip.Content side="left">
                    <p>{status === 'running' ? 'Stop' : 'Start'}</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </Tooltip.Provider>
        {#if status === 'stopped'}
            <Tooltip.Provider delayDuration={10}>
                <Tooltip.Root>
                    <Tooltip.Trigger class="bg-destructive">
                        {#snippet child({ props })}
                            <Button
                                {...props}
                                variant="outline"
                                size="icon"
                                disabled={actionState.disableActions}
                                onclick={() => (actionState.showDeleteDialog = true)}
                            >
                                <Delete class="text-destructive" />
                            </Button>
                        {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Content
                        side="right"
                        class="bg-destructive text-destructive-foreground"
                        arrowClasses="bg-destructive"
                    >
                        <p>Delete</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
            <ContainerDeleteDialog
                bind:open={actionState.showDeleteDialog}
                {handleDeleteContainer}
                {id}
            />
        {/if}

        {#if status === 'running'}
            <Tooltip.Provider delayDuration={150}>
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        {#snippet child({ props })}
                            <Button
                                {...props}
                                variant="outline"
                                size="icon"
                                onclick={handleShowInformationDrawer}
                                disabled={actionState.disableActions}
                            >
                                <Information />
                            </Button>
                        {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Content side="right">
                        <p>Container details</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
            <InformationDrawer bind:open={showInformationDrawer} {id} />
        {/if}
    </ButtonGroup.Root>
</div>
