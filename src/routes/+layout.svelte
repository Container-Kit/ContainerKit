<script>
    import '../app.css';
    import { Toaster } from '$lib/components/ui/sonner';
    import { mode, ModeWatcher } from 'mode-watcher';

    let { children } = $props();
</script>

<ModeWatcher defaultMode="light" track={true} defaultTheme="perpetuity" />
<Toaster theme={mode.current} richColors={true} closeButton={true} position="top-right" />

{@render children()}
