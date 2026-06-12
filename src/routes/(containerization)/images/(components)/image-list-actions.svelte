<script lang="ts">
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { Separator } from '$lib/components/ui/separator/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import Delete from '@lucide/svelte/icons/trash-2';
    import Box from '@lucide/svelte/icons/box';
    import ListIndentIncrease from '@lucide/svelte/icons/list-indent-increase';
    import Play from '@lucide/svelte/icons/play';
    import { createContainerDrawerData } from './images.svelte';
    import { confirmDelete } from '$lib/components/ui/confirm-delete-dialog';
    import { removeImage } from '$lib/services/containerization/images';
    import { getAllContainers } from '$lib/services/containerization/containers';
    import { toast } from 'svelte-sonner';
    import type { ContainerClient } from '$lib/models/container';
    import ImageListMoreActions from './image-list-more-actions.svelte';
    import * as ButtonGroup from '$lib/components/ui/button-group/index.js';

    type Props = {
        name: string;
        reference: string;
    };

    const { name, reference }: Props = $props();

    function showCreateContainerDrawer() {
        createContainerDrawerData.open = true;
        createContainerDrawerData.selected = name;
    }

    async function deleteImage() {
        const output = await getAllContainers();
        if (!output.ok) {
            toast.error('Error in getting container list', {
                description: output.error
            });
            return;
        }

        const containers: ContainerClient[] = output.data;
        const containersUsingImage = containers.filter(
            (container) => reference === container.configuration.image.reference
        );
        if (containersUsingImage.length > 0) {
            const containerIds = containersUsingImage.map(
                (container) => container.configuration.id
            );
            return toast.error(
                `You can't delete an image which is being used in containers: ${containerIds.join(', ')}`
            );
        }
        confirmDelete({
            title: 'Delete Image?',
            description: `Are you sure you want to delete <strong>${reference?.split('/').at(-1) ?? name}</strong> image?`,
            onConfirm: async () => {
                const result = await removeImage(reference);
                if (!result.ok) {
                    toast.error('Unable to delete image', { description: result.error });
                }
            }
        });
    }
</script>

<div class="flex items-center h-full gap-x-0.5">
    <ButtonGroup.Root>
        <Tooltip.Provider delayDuration={150}>
            <Tooltip.Root>
                <Tooltip.Trigger>
                    {#snippet child({ props })}
                        <Button variant="outline" {...props} onclick={showCreateContainerDrawer}>
                            <Play class="text-green-700 dark:text-green-400" />
                        </Button>
                    {/snippet}
                </Tooltip.Trigger>
                <Tooltip.Content
                    arrowClasses="bg-green-900"
                    side="left"
                    class="bg-green-900 text-green-100"
                >
                    Create Container
                </Tooltip.Content>
            </Tooltip.Root>
        </Tooltip.Provider>
        <Tooltip.Provider delayDuration={10}>
            <Tooltip.Root>
                <Tooltip.Trigger class="">
                    {#snippet child({ props })}
                        <Button {...props} variant="outline" size="icon" onclick={deleteImage}>
                            <Delete class="text-destructive" />
                        </Button>
                    {/snippet}
                </Tooltip.Trigger>
                <Tooltip.Content
                    side="top"
                    class="bg-destructive text-destructive-foreground"
                    arrowClasses="bg-destructive"
                >
                    <p>Delete Image</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </Tooltip.Provider>
        <Tooltip.Provider delayDuration={10}>
            <Tooltip.Root>
                <Tooltip.Trigger>
                    {#snippet child({ props })}
                        <ImageListMoreActions buttonProps={props} />
                    {/snippet}
                </Tooltip.Trigger>
                <Tooltip.Content
                    side="right"
                    class="bg-secondary text-secondary-foreground"
                    arrowClasses="bg-secondary"
                >
                    <p>More options</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </Tooltip.Provider>
    </ButtonGroup.Root>
</div>
