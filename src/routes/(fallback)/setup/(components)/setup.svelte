<script lang="ts">
    import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
    import { Button } from '$lib/components/ui/button/index.js';
    import * as Card from '$lib/components/ui/card/index.js';
    import { goto } from '$app/navigation';
    import { isSupportedVersion } from '$lib/stores/mac-os.svelte.js';
    import { createSymlink, hasContainerCli } from '$lib/services/containerization/setup.js';
    import { toast } from 'svelte-sonner';
    import { routes } from '$lib/helpers/routes';
    import { onMount } from 'svelte';

    async function startSymlink() {
        const containerCliExist = await hasContainerCli();
        if (containerCliExist) {
            return await goto(routes.Containers);
        }
        const output = await createSymlink();
        if (!output.ok) {
            return toast.error('Please complete the symlink process');
        }
        await goto(routes.Containers);
    }

    onMount(async () => {
        await startSymlink();
    });
</script>

<div class="flex items-center justify-center min-h-screen p-4">
    <Card.Root class="w-full max-w-md">
        <Card.Header class="text-center">
            <div
                class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900"
            >
                <TriangleAlert class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <Card.Title>Container CLI Error</Card.Title>
            <Card.Description><strong></strong></Card.Description>
        </Card.Header>
        <Card.Content class="space-y-4">
            <div class="flex flex-col gap-2">
                <Button variant="secondary" onclick={startSymlink}>Create Stmlink</Button>

                {#if isSupportedVersion()}
                    <Button variant="outline" onclick={() => goto('/')}>Start</Button>
                {/if}
            </div>
        </Card.Content>
    </Card.Root>
</div>
