<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { addRegistriesSeedV1 } from '$lib/db/seeds/registery';
    import Loader from '@lucide/svelte/icons/loader';
    import { isLoading } from './loading.svelte';

    onMount(async () => {
        await Promise.all([addRegistriesSeedV1()]);
        await goto('/containers');
        isLoading.setFalse();
    });
</script>

{#if isLoading.current}
    <div class="flex items-center justify-center h-screen w-full">
        <Loader class="size-5 animate-spin" />
    </div>
{/if}
