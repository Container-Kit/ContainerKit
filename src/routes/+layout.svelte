<script>
    import "../app.css"
    import { onMount } from "svelte";

    import {goto} from "$app/navigation";

    import { Toaster } from "$lib/components/ui/sonner";
    import { mode, ModeWatcher } from "mode-watcher";
    import { startContainerization } from "$lib/services/containerization/system.js";
    import { isUnsupported } from "$lib/stores/mac-os.svelte.js";

    // if (isUnsupported()) {
    //     goto("/unsupported");
    // }

    // onMount(async () => {
    //     await startContainerization()
    //     await goto('/containers')
    // })


    let { children } = $props();
</script>


<ModeWatcher defaultMode="light" track={true} defaultTheme="tangerine" />
<Toaster theme={mode.current} richColors={true} closeButton={true} />

{@render children()}
