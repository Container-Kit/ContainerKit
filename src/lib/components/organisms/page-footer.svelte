<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import Terminal from '$lib/components/molecules/terminal.svelte';
    import { Terminal as TerminalIcon, X, Minimize2 } from '@lucide/svelte';

    let open = $state(false);
    let minimized = $state(false);

    function handleToggleTerminal() {
        if (!open) {
            open = true;
            minimized = false;
        } else {
            open = false;
        }
    }

    function handleMinimize() {
        minimized = !minimized;
    }

    function handleClose() {
        open = false;
        minimized = false;
    }
</script>

<!-- Terminal Container -->
<div class="flex flex-col w-full">
    <div
        class="bg-background border border-border rounded-t-xl overflow-hidden transition-all duration-300 shadow-lg {open
            ? minimized
                ? 'opacity-100 translate-y-0 max-h-12 pointer-events-auto'
                : 'opacity-100 translate-y-0 max-h-[60vh] pointer-events-auto'
            : 'opacity-0 translate-y-4 max-h-0 border-0 min-h-0 pointer-events-none'}"
    >
        <div class="flex items-center justify-between bg-muted px-4 py-2 border-b border-border">
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        class="w-3 h-3 bg-destructive rounded-full hover:bg-destructive/80 transition-colors"
                        onclick={handleClose}
                        title="Close"
                    ></Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        class="w-3 h-3 bg-yellow-500 dark:bg-yellow-600 rounded-full hover:bg-yellow-400 dark:hover:bg-yellow-500 transition-colors"
                        onclick={handleMinimize}
                        title="Minimize"
                    ></Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        class="w-3 h-3 bg-emerald-500 dark:bg-emerald-600 rounded-full hover:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors"
                    ></Button>
                </div>
                <div class="flex items-center gap-2">
                    <TerminalIcon size={16} class="text-primary" />
                    <span class="text-sm font-medium text-foreground">Terminal</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    class="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onclick={handleMinimize}
                >
                    <Minimize2 size={12} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    class="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onclick={handleClose}
                >
                    <X size={12} />
                </Button>
            </div>
        </div>

        <!-- Terminal Body -->
        <div class="bg-background {minimized ? 'hidden' : 'block'}">
            <Terminal class="min-h-[40vh] max-h-[55vh] w-full" />
        </div>
    </div>

    <div
        class="flex flex-row items-center gap-x-2 bg-card px-4 py-2 border border-border transition-all rounded-b-xl duration-300 {open &&
        !minimized
            ? ' border-t-0'
            : ''}"
    >
        <Button
            variant="ghost"
            class="rounded-xl gap-2 text-muted-foreground hover:text-foreground hover:bg-muted"
            onclick={handleToggleTerminal}
        >
            <TerminalIcon size={16} />
            Terminal
        </Button>

        <div class="flex-1"></div>

        <div class="flex items-center gap-4 text-xs text-muted-foreground">
            <span>ContainerKit v1.0</span>
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Connected"></div>
        </div>
    </div>
</div>
