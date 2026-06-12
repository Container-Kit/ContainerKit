<script lang="ts">
    import { Xterm, XtermAddon } from '@battlefieldduck/xterm-svelte';
    import type {
        ITerminalOptions,
        ITerminalInitOnlyOptions,
        Terminal
    } from '@battlefieldduck/xterm-svelte';

    import { spawn } from 'tauri-pty';
    import { onDestroy } from 'svelte';
    import { getDefaultShell } from '$lib/helpers/default-shell.js';

    let terminal: Terminal | undefined = $state(undefined);
    let ptyProcess: ReturnType<typeof spawn>;
    let exited = false;

    type TerminalProps = {
        class?: string;
        sessionId?: string;
        onPtyCreated?: (ptyProcess: any) => void;
        container?: string;
    };

    let { class: className, sessionId, container, onPtyCreated }: TerminalProps = $props();

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

            // For a container, the PTY is the exec process itself — never a host
            // shell, so a failed/finished exec can't strand the user on the host.
            ptyProcess = container
                ? spawn('container', ['exec', '-i', '-t', container, 'sh'], {
                      cols: terminal.cols,
                      rows: terminal.rows
                  })
                : spawn(await getDefaultShell(), [], {
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
                if (ptyProcess && !exited) {
                    ptyProcess.write(data);
                }
            });

            ptyProcess.onExit(({ exitCode }) => {
                exited = true;
                terminal?.write(
                    `\r\n\x1b[90m[session ended with exit code ${exitCode}]\x1b[0m\r\n`
                );
            });

            // Handle resize events
            terminal.onResize(({ cols, rows }) => {
                if (ptyProcess && !exited) {
                    ptyProcess.resize(cols, rows);
                }

                fitAddon.fit();
                // Fix auto scroll to bottom of terminal when available
                if (terminal) {
                    terminal.scrollToBottom();
                }
            });

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

<div class={['terminal-container border-amber-300', className]}>
    <Xterm class="w-full h-full !scroll-mb-10 pb-2 {container && 'container-page'}" bind:terminal {options} {onLoad} />
</div>

<style lang="css">
    :global(.terminal-container .xterm) {
        padding: 12px;
    }

    :global(.terminal-container .xterm-viewport) {
        overflow-y: auto;
    }

    :global(.terminal-container .container-page .xterm-viewport) {
        border-radius: 10px;
    }
</style>
