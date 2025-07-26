<script>
    import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
    import { Button } from '../ui/button/index.js';
    import * as Card from '../ui/card';
    import { goto } from '$app/navigation';
    import { isSupportedVersion } from '$lib/stores/mac-os.svelte.js';
</script>

<div class="flex items-center justify-center min-h-screen p-4">
    <Card.Root class="w-full max-w-md">
        <Card.Header class="text-center">
            <div
                class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900"
            >
                <TriangleAlert class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <Card.Title>Containerization Stopped</Card.Title>
            <Card.Description
                >Yo have stopped containerization, please <strong>start the service again</strong
                >.</Card.Description
            >
        </Card.Header>
        <Card.Content class="space-y-4">
            <div class="flex flex-col gap-2">
                {#if isSupportedVersion()}
                    <Button variant="outline" onclick={() => goto('/')}>Start</Button>
                {/if}
            </div>
        </Card.Content>
    </Card.Root>
</div>
