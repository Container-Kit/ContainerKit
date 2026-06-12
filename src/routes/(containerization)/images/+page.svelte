<script lang="ts">
    import { getAllImages } from '$lib/services/containerization/images';
    import { onDestroy, onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    import type { ContainerImage } from '$lib/models/container/image';
    import { columns } from './(components)/column.svelte';
    import ImageList from './(components)/image-list.svelte';
    import type { UnwatchFn } from '@tauri-apps/plugin-fs';
    import { watchImageChanges } from '$lib/services/fs-events/images';
    import PullImageDialog from './(components)/pull-image.svelte';
    import ImageFromTarDialog from './(components)/image-from-tar.svelte';

    let images: ContainerImage[] = $state([]);
    let imageDirChangesWatcher: UnwatchFn | null = $state(null);
    let showPullImageDialog = $state(false);
    let showTarImageDialog = $state(false);

    async function getImageList() {
        const output = await getAllImages();

        if (!output.ok) {
            toast.error('Unable to fetch images', {
                description: output.error
            });
            return;
        }

        images = output.data;
    }

    onMount(async () => {
        await getImageList();
        imageDirChangesWatcher = await watchImageChanges(getImageList, 500);
    });

    onDestroy(() => {
        if (imageDirChangesWatcher) imageDirChangesWatcher();
    });
</script>

<div class="flex flex-1 flex-col">
    <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ImageList
                data={images}
                columns={columns()}
                bind:showPullImageDialog
                bind:showTarImageDialog
            />
        </div>
    </div>
</div>

<PullImageDialog bind:show={showPullImageDialog} />
<ImageFromTarDialog bind:show={showTarImageDialog} />
