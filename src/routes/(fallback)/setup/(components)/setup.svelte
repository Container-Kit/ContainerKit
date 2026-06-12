<script lang="ts">
    import Link from '@lucide/svelte/icons/link';
    import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Spinner } from '$lib/components/ui/spinner/index.js';
    import * as Card from '$lib/components/ui/card/index.js';
    import { goto } from '$app/navigation';
    import { createSymlink, hasContainerCli } from '$lib/services/containerization/setup.js';
    import { routes } from '$lib/helpers/routes';
    import { onMount } from 'svelte';

    let linking = $state(false);
    let errorMessage = $state('');

    async function startSymlink() {
        errorMessage = '';
        linking = true;
        const output = await createSymlink();

        if (!output.ok) {
            linking = false;
            errorMessage = output.error;
            return;
        }

        if (!(await hasContainerCli())) {
            linking = false;
            errorMessage = 'The container CLI is still not reachable after linking.';
            return;
        }

        // back to the root page so the normal bootstrap (system start) runs
        await goto(routes.Home);
    }

    onMount(async () => {
        if (await hasContainerCli()) {
            return goto(routes.Home);
        }
        // frictionless setup: link immediately, macOS shows one admin prompt
        await startSymlink();
    });
</script>

<div class="flex items-center justify-center min-h-screen p-4">
    <Card.Root class="w-full max-w-md">
        <Card.Header class="text-center">
            <div
                class={[
                    'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full',
                    errorMessage
                        ? 'bg-yellow-100 dark:bg-yellow-900'
                        : 'bg-blue-100 dark:bg-blue-900'
                ]}
            >
                {#if errorMessage}
                    <TriangleAlert class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                {:else}
                    <Link class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                {/if}
            </div>
            <Card.Title>Set up the Container CLI</Card.Title>
            <Card.Description>
                Container Kit links its bundled Apple container CLI into
                <code>/usr/local/bin</code> so it works system-wide. macOS will ask for your administrator
                password.
            </Card.Description>
        </Card.Header>
        <Card.Content class="space-y-4">
            {#if errorMessage}
                <p class="text-sm text-destructive text-center">{errorMessage}</p>
            {/if}
            <div class="flex flex-col gap-2">
                <Button variant="secondary" disabled={linking} onclick={startSymlink}>
                    {#if linking}
                        <Spinner /> Linking container CLI…
                    {:else}
                        <Link /> {errorMessage ? 'Try again' : 'Create symlink'}
                    {/if}
                </Button>
            </div>
        </Card.Content>
    </Card.Root>
</div>
