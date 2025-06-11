<script lang="ts">
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/app-sidebar.svelte";
    import SiteHeader from "$lib/components/site-header.svelte";

    let { children } = $props();
</script>

<ModeWatcher defaultMode="light" track={true} defaultTheme="tangerine" />

<div class="min-h-screen bg-background w-full">
    <Sidebar.Provider
        style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
    >
        <AppSidebar variant="inset" />
        <Sidebar.Inset>
            <SiteHeader />
            {@render children()}
        </Sidebar.Inset>
    </Sidebar.Provider>
</div>
