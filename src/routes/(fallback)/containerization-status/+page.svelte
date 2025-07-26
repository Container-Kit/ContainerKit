<script lang="ts">
    import ContainerizationStatus from '$lib/components/pages/containerization-status.svelte';
    import { onMount, onDestroy } from 'svelte';

    let removePopstateListener: null | (() => void) = null;

    onMount(() => {
        /**
         * This whole process is to disable going back to any pages when containerization is stopped.
         * */
        // Push a new state when the page loads to create a "dummy" history entry
        window.history.pushState(null, '', window.location.href);

        const handlePopstate = () => {
            // Push a new state when the page loads to create a "dummy" history entry
            window.history.pushState(null, '', window.location.href);
            window.history.go(1);
        };

        window.addEventListener('popstate', handlePopstate);
        removePopstateListener = () => window.removeEventListener('popstate', handlePopstate);
    });

    onDestroy(() => {
        if (removePopstateListener) {
            removePopstateListener();
        }
    });
</script>

<ContainerizationStatus />
