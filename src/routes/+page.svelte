<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { addRegistriesSeedV1 } from '$lib/db/seeds/registery';
    import Loader from '@lucide/svelte/icons/loader';

    let isLoading = $state(true);

    onMount(async () => {
        await Promise.all([addRegistriesSeedV1()]);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await goto('/containers');
        isLoading = false;
    });
</script>

{#if isLoading}
    <div class="flex items-center justify-center h-screen w-full">
        <Loader class="size-5 animate-spin" />
    </div>
{/if}
