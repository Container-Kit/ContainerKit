<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    import type { UnwatchFn } from '@tauri-apps/plugin-fs';
    import prettyBytes from 'pretty-bytes';
    import Plus from '@lucide/svelte/icons/plus';
    import Delete from '@lucide/svelte/icons/trash-2';
    import Database from '@lucide/svelte/icons/database';

    import * as Table from '$lib/components/ui/table/index.js';
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import * as Field from '$lib/components/ui/field/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Spinner } from '$lib/components/ui/spinner/index.js';
    import { ConfirmDeleteDialog, confirmDelete } from '$lib/components/ui/confirm-delete-dialog';

    import type { ContainerVolume } from '$lib/models/container';
    import {
        createVolume,
        getAllVolumes,
        removeVolume
    } from '$lib/services/containerization/volumes';
    import { watchVolumeChanges } from '$lib/services/fs-events/volumes';

    let volumes: ContainerVolume[] = $state([]);
    let volumeChangeWatcher: UnwatchFn | null = null;

    let createDialog = $state({ open: false, name: '', size: '', creating: false });

    async function getVolumeList() {
        const output = await getAllVolumes();
        if (!output.ok) {
            toast.error('Unable to fetch volumes', { description: output.error });
            return;
        }
        volumes = output.data;
    }

    async function handleCreateVolume(event: SubmitEvent) {
        event.preventDefault();
        createDialog.creating = true;
        const output = await createVolume(createDialog.name.trim(), createDialog.size.trim());
        createDialog.creating = false;
        if (!output.ok) {
            toast.error(`Unable to create volume ${createDialog.name}`, {
                description: output.error
            });
            return;
        }
        toast.success(`Volume ${createDialog.name} created`);
        createDialog = { open: false, name: '', size: '', creating: false };
        await getVolumeList();
    }

    function handleDeleteVolume(volume: ContainerVolume) {
        const name = volume.configuration.name;
        confirmDelete({
            title: 'Delete Volume?',
            description: `Are you sure you want to delete the <strong>${name}</strong> volume? Any data stored in it will be lost.`,
            onConfirm: async () => {
                const output = await removeVolume(name);
                if (!output.ok) {
                    toast.error(`Unable to delete volume ${name}`, {
                        description: output.error
                    });
                    return;
                }
                toast.success(`Volume ${name} deleted`);
                await getVolumeList();
            }
        });
    }

    onMount(async () => {
        await getVolumeList();
        volumeChangeWatcher = await watchVolumeChanges(getVolumeList, 500);
    });

    onDestroy(() => {
        if (volumeChangeWatcher) volumeChangeWatcher();
    });
</script>

<div class="flex flex-1 flex-col">
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div class="flex items-center justify-end">
                <Button onclick={() => (createDialog.open = true)}>
                    <Plus /> Create Volume
                </Button>
            </div>

            <div class="rounded-md border">
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Name</Table.Head>
                            <Table.Head>Driver</Table.Head>
                            <Table.Head>Format</Table.Head>
                            <Table.Head>Size</Table.Head>
                            <Table.Head class="text-right">Actions</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {#each volumes as volume (volume.id)}
                            <Table.Row>
                                <Table.Cell class="font-medium">
                                    {volume.configuration.name}
                                </Table.Cell>
                                <Table.Cell>{volume.configuration.driver ?? 'N/A'}</Table.Cell>
                                <Table.Cell>{volume.configuration.format ?? 'N/A'}</Table.Cell>
                                <Table.Cell>
                                    {volume.configuration.sizeInBytes != null
                                        ? prettyBytes(volume.configuration.sizeInBytes)
                                        : 'N/A'}
                                </Table.Cell>
                                <Table.Cell class="text-right">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onclick={() => handleDeleteVolume(volume)}
                                    >
                                        <Delete class="text-destructive" />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        {:else}
                            <Table.Row>
                                <Table.Cell colspan={5} class="h-24 text-center">
                                    <span
                                        class="flex items-center justify-center gap-2 text-muted-foreground"
                                    >
                                        <Database class="size-4" /> No volumes found
                                    </span>
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    </Table.Body>
                </Table.Root>
            </div>
        </div>
    </div>
</div>

<Dialog.Root bind:open={createDialog.open}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Create Volume</Dialog.Title>
            <Dialog.Description>Create a new volume for your containers</Dialog.Description>
        </Dialog.Header>
        <form onsubmit={handleCreateVolume}>
            <Field.Group>
                <Field.Field>
                    <Field.Label for="volume-name">Name</Field.Label>
                    <Input
                        id="volume-name"
                        required
                        autocorrect="off"
                        disabled={createDialog.creating}
                        bind:value={createDialog.name}
                        placeholder="my-volume"
                    />
                </Field.Field>
                <Field.Field>
                    <Field.Label for="volume-size">Size (optional)</Field.Label>
                    <Input
                        id="volume-size"
                        autocorrect="off"
                        disabled={createDialog.creating}
                        bind:value={createDialog.size}
                        placeholder="10G"
                    />
                    <Field.Description>
                        Bytes with optional K, M, G, T or P suffix; leave empty for the default
                    </Field.Description>
                </Field.Field>
                <Button type="submit" disabled={createDialog.creating || !createDialog.name.trim()}>
                    {#if createDialog.creating}
                        <Spinner /> Creating {createDialog.name}
                    {:else}
                        <Plus /> Create
                    {/if}
                </Button>
            </Field.Group>
        </form>
    </Dialog.Content>
</Dialog.Root>

<ConfirmDeleteDialog />
