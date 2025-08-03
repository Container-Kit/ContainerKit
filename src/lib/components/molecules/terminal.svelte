<script lang="ts">
    import { Xterm, XtermAddon } from '@battlefieldduck/xterm-svelte';
    import type {
        ITerminalOptions,
        ITerminalInitOnlyOptions,
        Terminal
    } from '@battlefieldduck/xterm-svelte';

    import { spawn } from 'tauri-pty';

    let terminal: Terminal | null = $state(null);

    type TerminalProps = {
        class?: string;
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
            // Load addons
            const fitAddon = new (await XtermAddon.FitAddon()).FitAddon();
            const webLinksAddon = new (await XtermAddon.WebLinksAddon()).WebLinksAddon();
            const searchAddon = new (await XtermAddon.SearchAddon()).SearchAddon();

            // Load addons to terminal
            terminal?.loadAddon(fitAddon);
            terminal?.loadAddon(webLinksAddon);
            terminal?.loadAddon(searchAddon);

            // Try to load WebGL addon with fallback
            try {
                const webglAddon = new (await XtermAddon.WebglAddon()).WebglAddon();
                terminal?.loadAddon(webglAddon);
            } catch (e) {
                console.warn('WebGL addon failed to load, using canvas renderer');
            }

            // Fit terminal to container
            setTimeout(() => fitAddon.fit(), 100);

            // Create PTY process
            const pty = spawn('zsh', [], {
                cols: terminal?.cols || 80,
                rows: terminal?.rows || 24
            });

            // Handle data flow
            pty.onData((data) => {
                if (terminal) {
                    terminal.write(data);
                }
            });

            terminal?.onData((data) => {
                if (pty) {
                    pty.write(data);
                }
            });

            // Handle resize events
            terminal?.onResize(({ cols, rows }) => {
                if (pty) {
                    pty.resize(cols, rows);
                }
            });

            setTimeout(() => terminal?.focus(), 200);
        } catch (error) {
            console.error('Terminal initialization failed:', error);
            if (terminal) {
                terminal.writeln(
                    '\x1b[31mTerminal initialization failed. Please try again.\x1b[0m'
                );
            }
        }
    }

    let { class: className }: TerminalProps = $props();
</script>

<div class={['terminal-container', className]}>
    <Xterm class="w-full h-full" bind:terminal {options} {onLoad} />
</div>
