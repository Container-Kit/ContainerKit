<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    import type { UnwatchFn } from '@tauri-apps/plugin-fs';
    import Plus from '@lucide/svelte/icons/plus';
    import Delete from '@lucide/svelte/icons/trash-2';
    import Network from '@lucide/svelte/icons/network';

    import * as Table from '$lib/components/ui/table/index.js';
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import * as Field from '$lib/components/ui/field/index.js';
    import { Badge } from '$lib/components/ui/badge/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Spinner } from '$lib/components/ui/spinner/index.js';
    import { ConfirmDeleteDialog, confirmDelete } from '$lib/components/ui/confirm-delete-dialog';

    import { isBuiltinNetwork, type ContainerNetwork } from '$lib/models/container';
    import {
        createNetwork,
        getAllNetworks,
        removeNetwork
    } from '$lib/services/containerization/networks';
    import { watchNetworkChanges } from '$lib/services/fs-events/network';

    let networks: ContainerNetwork[] = $state([]);
    let networkChangeWatcher: UnwatchFn | null = null;

    let createDialog = $state({ open: false, name: '', subnet: '', creating: false });

    async function getNetworkList() {
        const output = await getAllNetworks();
        if (!output.ok) {
            toast.error('Unable to fetch networks', { description: output.error });
            return;
        }
        networks = output.data;
    }

    async function handleCreateNetwork(event: SubmitEvent) {
        event.preventDefault();
        createDialog.creating = true;
        const output = await createNetwork(createDialog.name.trim(), createDialog.subnet.trim());
        createDialog.creating = false;
        if (!output.ok) {
            toast.error(`Unable to create network ${createDialog.name}`, {
                description: output.error
            });
            return;
        }
        toast.success(`Network ${createDialog.name} created`);
        createDialog = { open: false, name: '', subnet: '', creating: false };
        await getNetworkList();
    }

    function handleDeleteNetwork(network: ContainerNetwork) {
        const name = network.configuration.name;
        confirmDelete({
            title: 'Delete Network?',
            description: `Are you sure you want to delete the <strong>${name}</strong> network?`,
            onConfirm: async () => {
                const output = await removeNetwork(name);
                if (!output.ok) {
                    toast.error(`Unable to delete network ${name}`, {
                        description: output.error
                    });
                    return;
                }
                toast.success(`Network ${name} deleted`);
                await getNetworkList();
            }
        });
    }

    onMount(async () => {
        await getNetworkList();
        networkChangeWatcher = await watchNetworkChanges(getNetworkList, 500);
    });

    onDestroy(() => {
        if (networkChangeWatcher) networkChangeWatcher();
    });
</script>

<div class="flex flex-1 flex-col">
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div class="flex items-center justify-end">
                <Button onclick={() => (createDialog.open = true)}>
                    <Plus /> Create Network
                </Button>
            </div>

            <div class="rounded-md border">
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Name</Table.Head>
                            <Table.Head>Mode</Table.Head>
                            <Table.Head>Subnet</Table.Head>
                            <Table.Head>Gateway</Table.Head>
                            <Table.Head class="text-right">Actions</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {#each networks as network (network.id)}
                            <Table.Row>
                                <Table.Cell class="font-medium">
                                    <span class="flex items-center gap-2">
                                        {network.configuration.name}
                                        {#if isBuiltinNetwork(network)}
                                            <Badge variant="outline">built-in</Badge>
                                        {/if}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>{network.configuration.mode ?? 'N/A'}</Table.Cell>
                                <Table.Cell>{network.status?.ipv4Subnet ?? 'N/A'}</Table.Cell>
                                <Table.Cell>{network.status?.ipv4Gateway ?? 'N/A'}</Table.Cell>
                                <Table.Cell class="text-right">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        disabled={isBuiltinNetwork(network)}
                                        onclick={() => handleDeleteNetwork(network)}
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
                                        <Network class="size-4" /> No networks found
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
            <Dialog.Title>Create Network</Dialog.Title>
            <Dialog.Description>Create a new network for your containers</Dialog.Description>
        </Dialog.Header>
        <form onsubmit={handleCreateNetwork}>
            <Field.Group>
                <Field.Field>
                    <Field.Label for="network-name">Name</Field.Label>
                    <Input
                        id="network-name"
                        required
                        autocorrect="off"
                        disabled={createDialog.creating}
                        bind:value={createDialog.name}
                        placeholder="my-network"
                    />
                </Field.Field>
                <Field.Field>
                    <Field.Label for="network-subnet">Subnet (optional)</Field.Label>
                    <Input
                        id="network-subnet"
                        autocorrect="off"
                        disabled={createDialog.creating}
                        bind:value={createDialog.subnet}
                        placeholder="192.168.65.0/24"
                    />
                    <Field.Description>Leave empty to let the CLI pick one</Field.Description>
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
