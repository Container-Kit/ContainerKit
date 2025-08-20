<script lang="ts">
    import { Xterm, XtermAddon } from '@battlefieldduck/xterm-svelte';
    import type {
        ITerminalOptions,
        ITerminalInitOnlyOptions,
        Terminal
    } from '@battlefieldduck/xterm-svelte';

    import { spawn } from 'tauri-pty';
    import { onDestroy } from 'svelte';

    let terminal: Terminal | undefined = $state(undefined);
    let ptyProcess: ReturnType<typeof spawn>;

    type TerminalProps = {
        class?: string;
        sessionId?: string;
        onPtyCreated?: (ptyProcess: any) => void;
        container?: string
    };

    let options: ITerminalOptions & ITerminalInitOnlyOptions = {
        fontFamily:
            '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
        fontSize: 14,
        fontWeight: '400',
        fontWeightBold: '700',
        lineHeight: 1.4,
        letterSpacing: 0.5,
        cursorBlink: true,
        cursorStyle: 'block',
        allowTransparency: true,
        scrollback: 1000,
        tabStopWidth: 4,
        screenReaderMode: false,
        allowProposedApi: true
    };

    async function onLoad() {
        try {
            if (!terminal) return;
            // Load addons
            const fitAddon = new (await XtermAddon.FitAddon()).FitAddon();
            const webLinksAddon = new (await XtermAddon.WebLinksAddon()).WebLinksAddon();
            const searchAddon = new (await XtermAddon.SearchAddon()).SearchAddon();

            // Load addons to terminal
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(webLinksAddon);
            terminal.loadAddon(searchAddon);

            // Try to load WebGL addon with fallback
            try {
                const webglAddon = new (await XtermAddon.WebglAddon()).WebglAddon();
                terminal.loadAddon(webglAddon);
            } catch (e) {
                console.warn('WebGL addon failed to load, using canvas renderer');
            }

            // Fit terminal to container
            setTimeout(() => fitAddon.fit(), 10);

            // Create PTY process
            ptyProcess = spawn('zsh', [], {
                cols: terminal.cols,
                rows: terminal.rows
            });

            // Notify parent component about PTY creation
            if (onPtyCreated) {
                onPtyCreated(ptyProcess);
            }

            // Handle data flow
            ptyProcess.onData((data) => {
                if (terminal) {
                    terminal.write(data);
                }
            });

            terminal.onData((data) => {
                if (ptyProcess) {
                    ptyProcess.write(data);
                }
            });

            // Handle resize events
            terminal.onResize(({ cols, rows }) => {
                if (ptyProcess) {
                    ptyProcess.resize(cols, rows);
                }

                fitAddon.fit();
                // Fix auto scroll to bottom of terminal when available
                if (terminal) {
                    terminal.scrollToBottom();
                }
            });

            // Access running container shell
            if (container) {
                ptyProcess.write(`container exec -it ${container} sh \r`)
            }

            setTimeout(() => terminal?.focus(), 100);
        } catch (error) {
            console.error('Terminal initialization failed:', error);
            if (terminal) {
                terminal.writeln(
                    '\x1b[31mTerminal initialization failed. Please try again.\x1b[0m'
                );
            }
        }
    }

    let { class: className, sessionId, container, onPtyCreated }: TerminalProps = $props();

    // Cleanup PTY process when component is destroyed
    onDestroy(() => {
        if (ptyProcess) {
            try {
                ptyProcess.kill();
                console.log(`Cleaned up PTY process for session: ${sessionId || 'unknown'}`);
            } catch (error) {
                console.warn(`Failed to cleanup PTY process:`, error);
            }
        }
    });
</script>

<!-- fix: scroll bottom margin so content doesn't hide behind the terminal container suggestion -->
<div class={['terminal-container', className]}>
    <Xterm class="w-full h-full !scroll-mb-10 pb-2" bind:terminal {options} {onLoad} />
</div>

<style lang="css">
    :global(.terminal-container .xterm) {
        padding: 12px;
    }

    :global(.terminal-container .xterm-viewport) {
        overflow-y: auto;
    }
</style>
