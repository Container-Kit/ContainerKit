<script lang="ts">
    import { getAllImages } from '$lib/services/containerization/images';
    import { onMount } from 'svelte';
    import type { ErrorLog } from '$lib/models/utils';
    import { toast } from 'svelte-sonner';
    import type { ContainerImage } from '$lib/models/container/image';

    let error: ErrorLog | null = $state(null);
    let images: ContainerImage[] = $state([]);

    async function getImageList() {
        const output = await getAllImages();

        if (output.error) {
            toast.error(output.message);
            error = output;
            return;
        }

        if (!output.stdout) {
            error = output;
            return;
        }

        console.log(output);

        images = JSON.parse(output.stdout) ?? [];
    }

    onMount(async () => {
        await getImageList();
    });
</script>
