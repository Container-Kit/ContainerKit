<script lang="ts">
    import { page } from "$app/state";
    import AppSidebar from "$lib/components/organisms/sidebar/app-sidebar.svelte";
    import SiteHeader from "$lib/components/organisms/sidebar/site-header.svelte";
    import * as Sidebar from "$lib/components/ui/sidebar";

    let { children } = $props();

    let route = $derived(page.url.pathname);
</script>

<div class="flex min-h-svh bg-background w-full">
    <Sidebar.Provider
        style="--sidebar-width: calc(var(--spacing) * 65); --header-height: calc(var(--spacing) * 20);"
    >
        <AppSidebar variant="inset" collapsible="icon"/>
        <Sidebar.Inset>
            <SiteHeader {route} />
            <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
                {@render children()}
            </div>
        </Sidebar.Inset>
    </Sidebar.Provider>
</div>
