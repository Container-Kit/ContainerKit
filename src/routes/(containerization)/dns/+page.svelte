<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    import type { UnwatchFn } from '@tauri-apps/plugin-fs';
    import Plus from '@lucide/svelte/icons/plus';
    import Delete from '@lucide/svelte/icons/trash-2';
    import Globe from '@lucide/svelte/icons/globe';
    import ShieldAlert from '@lucide/svelte/icons/shield-alert';

    import * as Table from '$lib/components/ui/table/index.js';
    import * as Alert from '$lib/components/ui/alert/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Spinner } from '$lib/components/ui/spinner/index.js';
    import { ConfirmDeleteDialog, confirmDelete } from '$lib/components/ui/confirm-delete-dialog';

    import {
        createDnsDomain,
        listDnsDomains,
        removeDnsDomain
    } from '$lib/services/containerization/system/dns';
    import { watchDnsResolverChanges } from '$lib/services/fs-events/dns';

    let domains: string[] = $state([]);
    let newDomain = $state('');
    let creating = $state(false);
    let dnsChangeWatcher: UnwatchFn | null = null;

    async function getDomainList() {
        const output = await listDnsDomains();
        if (!output.ok) {
            toast.error('Unable to fetch DNS domains', { description: output.error });
            return;
        }
        domains = output.data;
    }

    async function handleCreateDomain(event: SubmitEvent) {
        event.preventDefault();
        const domain = newDomain.trim();
        creating = true;
        const output = await createDnsDomain(domain);
        creating = false;
        if (!output.ok) {
            toast.error(`Unable to create DNS domain ${domain}`, {
                description: output.error
            });
            return;
        }
        toast.success(`DNS domain ${domain} created`);
        newDomain = '';
        await getDomainList();
    }

    function handleDeleteDomain(domain: string) {
        confirmDelete({
            title: 'Delete DNS Domain?',
            description: `Are you sure you want to delete the <strong>${domain}</strong> local DNS domain? You will be asked for administrator access.`,
            onConfirm: async () => {
                const output = await removeDnsDomain(domain);
                if (!output.ok) {
                    toast.error(`Unable to delete DNS domain ${domain}`, {
                        description: output.error
                    });
                    return;
                }
                toast.success(`DNS domain ${domain} deleted`);
                await getDomainList();
            }
        });
    }

    onMount(async () => {
        await getDomainList();
        dnsChangeWatcher = await watchDnsResolverChanges(getDomainList, 500);
    });

    onDestroy(() => {
        if (dnsChangeWatcher) dnsChangeWatcher();
    });
</script>

<div class="flex flex-1 flex-col">
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Alert.Root>
                <ShieldAlert />
                <Alert.Title>Administrator access required</Alert.Title>
                <Alert.Description>
                    Creating or deleting a local DNS domain modifies /etc/resolver, so macOS will
                    prompt for your administrator password.
                </Alert.Description>
            </Alert.Root>

            <form class="flex items-center gap-2" onsubmit={handleCreateDomain}>
                <Input
                    class="max-w-xs"
                    required
                    autocorrect="off"
                    disabled={creating}
                    bind:value={newDomain}
                    placeholder="test"
                />
                <Button type="submit" disabled={creating || !newDomain.trim()}>
                    {#if creating}
                        <Spinner /> Creating
                    {:else}
                        <Plus /> Create Domain
                    {/if}
                </Button>
            </form>

            <div class="rounded-md border">
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Domain</Table.Head>
                            <Table.Head class="text-right">Actions</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {#each domains as domain (domain)}
                            <Table.Row>
                                <Table.Cell class="font-medium">{domain}</Table.Cell>
                                <Table.Cell class="text-right">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onclick={() => handleDeleteDomain(domain)}
                                    >
                                        <Delete class="text-destructive" />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        {:else}
                            <Table.Row>
                                <Table.Cell colspan={2} class="h-24 text-center">
                                    <span
                                        class="flex items-center justify-center gap-2 text-muted-foreground"
                                    >
                                        <Globe class="size-4" /> No local DNS domains
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

<ConfirmDeleteDialog />
