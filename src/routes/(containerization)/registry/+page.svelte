<script lang="ts">
    import { registryLogin } from '$lib/services/containerization/registry/auth';
    import { type ComponentProps, onMount } from 'svelte';
    import RegistryCard from './(components)/registry-card.svelte';
    import DeleteConfirmationDialog from '$lib/components/molecules/delete-confirmation-dialog.svelte';
    import type { InsertRegistry } from '$lib/models/container';

    const { data } = $props();
    let showDeleteDialog: boolean = $state(false);
    let deleteDialogProps: Omit<ComponentProps<typeof DeleteConfirmationDialog>, 'open'> | null = $state(null)
    function removeRegistry() {
        showDeleteDialog = false;
        deleteDialogProps = null;
    }

    function handleDeleteRegistry(registry: InsertRegistry) {
        deleteDialogProps = {
            title: `Are you sure about deleting ${registry.name} registry?`,
            description: `The ${registry.name} registry is selected for deletion. Any additional data associated with this registry are also deleted.`,
            deleteAction: removeRegistry,
            onClose() {
                deleteDialogProps = null
            },
        };
        showDeleteDialog = true;
    }
</script>
<div class="flex flex-col w-full h-full">
    <div class="flex flex-col items-center justify-normal">

    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {#each data.registries as registry (registry.id)}
            {@const props = {
                ...registry,
                isDefault: data.defaultRegistry === registry.url,
            }}
            <RegistryCard {...props} handleDeleteRegistry={() => handleDeleteRegistry(registry)}/>
        {/each}
    </div>
</div>

{#if deleteDialogProps}
    <DeleteConfirmationDialog {...deleteDialogProps} bind:open={showDeleteDialog} />
{/if}