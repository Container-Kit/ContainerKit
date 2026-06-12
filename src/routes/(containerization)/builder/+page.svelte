<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    import type { UnwatchFn } from '@tauri-apps/plugin-fs';
    import Hammer from '@lucide/svelte/icons/hammer';
    import CirclePlay from '@lucide/svelte/icons/circle-play';
    import CircleStop from '@lucide/svelte/icons/circle-stop';
    import Delete from '@lucide/svelte/icons/trash-2';
    import Circle from '@lucide/svelte/icons/circle';

    import * as Card from '$lib/components/ui/card/index.js';
    import { Badge } from '$lib/components/ui/badge/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Spinner } from '$lib/components/ui/spinner/index.js';
    import { ConfirmDeleteDialog, confirmDelete } from '$lib/components/ui/confirm-delete-dialog';

    import {
        builderStatus,
        removeBuilder,
        startBuilder,
        stopBuilder,
        type BuilderState
    } from '$lib/services/containerization/builder';
    import { watchContainerChanges } from '$lib/services/fs-events/containers';

    let builder: BuilderState | null = $state(null);
    let busy = $state(false);
    // the builder runs as a container, so container changes cover it
    let builderChangeWatcher: UnwatchFn | null = null;

    const statusLabel = $derived(
        builder === 'running' ? 'Running' : builder === 'stopped' ? 'Stopped' : 'Not created'
    );
    const statusColor = $derived(
        builder === 'running'
            ? 'text-green-500'
            : builder === 'stopped'
              ? 'text-red-500'
              : 'text-gray-500'
    );

    async function getBuilderStatus() {
        const output = await builderStatus();
        if (!output.ok) {
            toast.error('Unable to fetch builder status', { description: output.error });
            return;
        }
        builder = output.data;
    }

    async function runBuilderAction(
        action: () => Promise<{ ok: boolean; error?: string }>,
        verb: string
    ) {
        busy = true;
        const output = await action();
        busy = false;
        if (!output.ok) {
            toast.error(`Unable to ${verb} builder`, { description: output.error });
            return;
        }
        toast.success(`Builder ${verb} successful`);
        await getBuilderStatus();
    }

    function handleDeleteBuilder() {
        confirmDelete({
            title: 'Delete Builder?',
            description:
                'Are you sure you want to delete the builder container? It will be recreated on the next build.',
            onConfirm: async () => {
                await runBuilderAction(() => removeBuilder(), 'delete');
            }
        });
    }

    onMount(async () => {
        await getBuilderStatus();
        builderChangeWatcher = await watchContainerChanges(getBuilderStatus, 500);
    });

    onDestroy(() => {
        if (builderChangeWatcher) builderChangeWatcher();
    });
</script>

<div class="flex flex-1 flex-col">
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Card.Root class="max-w-xl">
                <Card.Header>
                    <Card.Title class="flex items-center gap-2">
                        <Hammer class="size-5" /> Image Builder
                    </Card.Title>
                    <Card.Description>
                        The builder is a dedicated container that runs BuildKit to build images. It
                        starts automatically on the first <code>container build</code>, and you can
                        manage it here.
                    </Card.Description>
                    <Card.Action>
                        {#if builder === null}
                            <Spinner />
                        {:else}
                            <Badge variant={builder === 'running' ? 'secondary' : 'outline'}>
                                <Circle class={`h-2 w-2 fill-current ${statusColor}`} />
                                {statusLabel}
                            </Badge>
                        {/if}
                    </Card.Action>
                </Card.Header>
                <Card.Content>
                    <div class="flex items-center gap-2">
                        {#if builder === 'running'}
                            <Button
                                variant="outline"
                                disabled={busy}
                                onclick={() => runBuilderAction(() => stopBuilder(), 'stop')}
                            >
                                {#if busy}<Spinner />{:else}<CircleStop class="text-red-400" />{/if}
                                Stop
                            </Button>
                        {:else}
                            <Button
                                variant="outline"
                                disabled={busy || builder === null}
                                onclick={() => runBuilderAction(() => startBuilder(), 'start')}
                            >
                                {#if busy}<Spinner />{:else}<CirclePlay
                                        class="text-green-400"
                                    />{/if} Start
                            </Button>
                        {/if}
                        <Button
                            variant="outline"
                            disabled={busy || builder === null || builder === 'none'}
                            onclick={handleDeleteBuilder}
                        >
                            <Delete class="text-destructive" /> Delete
                        </Button>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>

<ConfirmDeleteDialog />
