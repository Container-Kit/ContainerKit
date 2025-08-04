<script lang="ts">
    import Terminal from '$lib/components/molecules/terminal.svelte';
    import TerminalHeader from '$lib/components/molecules/terminal/header.svelte';
    import TabsBar from '$lib/components/molecules/terminal/tabs-bar.svelte';
    import { Button } from '$lib/components/ui/button';
    import { useSidebar } from '$lib/components/ui/sidebar';
    import SessionBadge from '$lib/components/atoms/terminal/session-badge.svelte';
    import { Terminal as TerminalIcon, Minimize2, Maximize2, GripVertical } from '@lucide/svelte';
    import { cn } from '$lib/utils';
    import { getName, getVersion } from '@tauri-apps/api/app';
    import { onMount, onDestroy } from 'svelte';

    type TerminalSession = {
        id: string;
        title: string;
        active: boolean;
        editing: boolean;
        ptyProcess?: any;
    };

    let open = $state(false);
    let minimized = $state(false);
    let sessions = $state<TerminalSession[]>([]);
    let activeSessionId = $state<string | null>(null);
    let editingValue = $state('');
    let version = $state('0.0.0');
    let appName = $state('Container Kit');
    let DEFAULT_BOTTOM_TOOLBAR_POSITION = 8;
    // Dragging and positioning state
    let isDragging = $state(false);
    let dragStartY = $state(0);
    let dragStartBottom = $state(0);
    let toolbarBottom = $state(DEFAULT_BOTTOM_TOOLBAR_POSITION); // Initial bottom position (bottom-2 = 8px)
    let toolbarElement: HTMLDivElement | null = $state(null);
    let showDragGuide = $state(false);

    // Position persistence
    const STORAGE_KEY = 'container-kit-toolbar-position';

    const sidebar = useSidebar();

    onMount(async () => {
        version = await getVersion();
        appName = await getName();

        // Load saved position
        const savedPosition = localStorage.getItem(STORAGE_KEY);
        if (savedPosition) {
            const position = parseInt(savedPosition, 10);
            if (!isNaN(position) && position >= DEFAULT_BOTTOM_TOOLBAR_POSITION) {
                toolbarBottom = Math.min(position, window.innerHeight - 100);
            }
        }
        console.log(savedPosition, toolbarBottom);
    });

    onDestroy(() => {
        // Save position on unmount
        localStorage.setItem(STORAGE_KEY, toolbarBottom.toString());
    });

    function handleToggleTerminal() {
        if (!open) {
            open = true;
            minimized = false;
            if (sessions.length === 0) {
                createNewSession();
            }
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

    function createNewSession() {
        const existingSession = new Set(
            sessions
                .map((session) => {
                    const match = session.title.match(/^Terminal (\d+)$/);
                    return match ? parseInt(match[1], 10) : 0;
                })
                .filter((num) => num > 0)
        );

        let nextSession = 1;
        while (existingSession.has(nextSession)) {
            nextSession++;
        }

        const newSession: TerminalSession = {
            id: `terminal-${Date.now()}-${nextSession}`,
            title: `Terminal ${nextSession}`,
            active: true,
            editing: false
        };

        sessions = sessions.map((session) => ({ ...session, active: false, editing: false }));
        sessions = [...sessions, newSession];
        activeSessionId = newSession.id;
    }

    function switchToSession(sessionId: string) {
        if (sessions.some((s) => s.editing)) return;

        sessions = sessions.map((session) => ({
            ...session,
            active: session.id === sessionId
        }));
        activeSessionId = sessionId;
    }

    function closeSession(sessionId: string) {
        const session = sessions.find((s) => s.id === sessionId);
        if (session?.ptyProcess) {
            try {
                session.ptyProcess.kill();
                console.log(`Closed PTY process for session: ${sessionId}`);
            } catch (error) {
                console.warn(`Failed to close PTY process for session ${sessionId}:`, error);
            }
        }

        const sessionIndex = sessions.findIndex((s) => s.id === sessionId);
        sessions = sessions.filter((s) => s.id !== sessionId);

        if (sessions.length === 0) {
            activeSessionId = null;
            open = false;
            minimized = false;
        } else if (sessionId === activeSessionId) {
            const newActiveIndex = Math.max(0, sessionIndex - 1);
            const newActiveSession = sessions[newActiveIndex];
            switchToSession(newActiveSession.id);
        }
    }

    function startEditing(sessionId: string) {
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
            sessions = sessions.map((s) => ({ ...s, editing: false }));
            sessions = sessions.map((s) => (s.id === sessionId ? { ...s, editing: true } : s));
            editingValue = session.title;
        }
    }

    function saveEdit(sessionId: string) {
        if (editingValue.trim()) {
            sessions = sessions.map((s) =>
                s.id === sessionId ? { ...s, title: editingValue.trim(), editing: false } : s
            );
        } else {
            cancelEdit(sessionId);
        }
        editingValue = '';
    }

    function cancelEdit(sessionId: string) {
        sessions = sessions.map((s) => (s.id === sessionId ? { ...s, editing: false } : s));
        editingValue = '';
    }

    function handleKeydown(event: KeyboardEvent, sessionId: string) {
        if (event.key === 'Enter') {
            saveEdit(sessionId);
        } else if (event.key === 'Escape') {
            cancelEdit(sessionId);
        }
    }

    function handleEditValueChange(value: string) {
        editingValue = value;
    }

    function setPtyProcess(sessionId: string, ptyProcess: any) {
        sessions = sessions.map((s) => (s.id === sessionId ? { ...s, ptyProcess } : s));
    }

    // Drag functionality for mouse
    function handleDragStart(event: MouseEvent) {
        isDragging = true;
        showDragGuide = true;
        dragStartY = event.clientY;
        dragStartBottom = toolbarBottom;
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.body.style.cursor = 'grabbing';
        event.preventDefault();
    }

    function handleDragMove(event: MouseEvent) {
        if (!isDragging) return;

        const deltaY = dragStartY - event.clientY; // Inverted because bottom positioning
        const windowHeight = window.innerHeight;
        const toolbarHeight = toolbarElement?.offsetHeight || 100;
        const maxBottom = windowHeight - toolbarHeight - DEFAULT_BOTTOM_TOOLBAR_POSITION;
        const newBottom = Math.max(
            DEFAULT_BOTTOM_TOOLBAR_POSITION,
            Math.min(maxBottom, dragStartBottom + deltaY)
        );
        toolbarBottom = newBottom;

        // Save position during drag
        localStorage.setItem(STORAGE_KEY, newBottom.toString());
    }

    function handleDragEnd() {
        isDragging = false;
        showDragGuide = false;
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
    }

    // Reset toolbar position
    function resetPosition() {
        toolbarBottom = DEFAULT_BOTTOM_TOOLBAR_POSITION;
        localStorage.setItem(STORAGE_KEY, DEFAULT_BOTTOM_TOOLBAR_POSITION.toString());
    }

    // Keyboard support for drag handle
    function handleDragKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            resetPosition();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const windowHeight = window.innerHeight;
            const toolbarHeight = toolbarElement?.offsetHeight || 100;
            const maxBottom = windowHeight - toolbarHeight - DEFAULT_BOTTOM_TOOLBAR_POSITION;
            const newBottom = Math.min(maxBottom, toolbarBottom + 10);
            toolbarBottom = newBottom;
            localStorage.setItem(STORAGE_KEY, newBottom.toString());
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            const newBottom = Math.max(DEFAULT_BOTTOM_TOOLBAR_POSITION, toolbarBottom - 10);
            toolbarBottom = newBottom;
            localStorage.setItem(STORAGE_KEY, newBottom.toString());
        }
    }

    // Calculate responsive width - exactly same as sidebar inset content area
    let toolbarWidth = $derived.by(() => {
        // Sidebar inset has: p-4 (1rem) and m-2 (0.5rem) on right, ml-0 (expanded) or ml-2 (collapsed)
        // Content area inside inset: 100vw - sidebar-width - 0.5rem (right margin) - 2rem (left+right padding)
        return sidebar.state === 'expanded'
            ? 'calc(100vw - var(--sidebar-width) - 2.5rem)'
            : 'calc(100vw - var(--sidebar-width-icon) - 3rem)';
    });

    // Calculate responsive left offset - maintain same ratio for both states
    let toolbarLeft = $derived.by(() => {
        // Calculate the inset content area start position
        // Both states should align the same way relative to their content area
        return sidebar.state === 'expanded'
            ? 'calc(var(--sidebar-width) + 1rem)'
            : 'calc(var(--sidebar-width-icon) + 2rem)';
    });
</script>

<!-- Floating Toolbar Container -->
<div
    bind:this={toolbarElement}
    class={cn(
        'toolbar-container fixed z-50 flex flex-col',
        isDragging && 'select-none cursor-grabbing shadow-2xl',
        !isDragging && 'hover:shadow-xl transition-all duration-200',
        showDragGuide && 'ring-2 ring-primary/30 ring-offset-2'
    )}
    style={`
        bottom: ${toolbarBottom}px;
        left: ${toolbarLeft};
        width: ${toolbarWidth};
        transition: ${isDragging ? 'none' : 'left 200ms cubic-bezier(0.4, 0, 0.2, 1), width 200ms cubic-bezier(0.4, 0, 0.2, 1)'};
    `}
>
    <!-- Terminal Content -->
    <div
        class={cn(
            'bg-background/95 border border-border rounded-t-xl overflow-hidden backdrop-blur-md shadow-xl',
            'transition-all duration-300 ease-out ring-1 ring-black/5',
            open
                ? minimized
                    ? 'opacity-100 translate-y-0 max-h-12 pointer-events-auto'
                    : 'opacity-100 translate-y-0 max-h-[52vh] pointer-events-auto'
                : 'opacity-0 translate-y-4 max-h-0 border-0 min-h-0 pointer-events-none'
        )}
    >
        <!-- Terminal Header with Drag Handle -->
        <div
            class={cn(
                'cursor-grab active:cursor-grabbing transition-all duration-200 group',
                'hover:bg-muted/30 rounded-t-xl -m-px p-px relative',
                isDragging && 'bg-muted/40'
            )}
            onmousedown={handleDragStart}
            ondblclick={resetPosition}
            onkeydown={handleDragKeydown}
            role="button"
            tabindex="0"
            aria-label="Drag to move toolbar • Double-click to reset position"
            title="Drag terminal to move • Double-click to reset position"
        >
            <!-- Subtle drag indicator dots -->
            <div
                class="absolute top-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-50 transition-opacity duration-200"
            >
                <div class="flex gap-1">
                    <div class="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    <div class="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    <div class="w-1 h-1 bg-muted-foreground rounded-full"></div>
                </div>
            </div>
            <TerminalHeader
                onClose={handleClose}
                onMinimize={handleMinimize}
                onNewTab={createNewSession}
            />
        </div>

        <!-- Terminal Tabs -->
        {#if !minimized}
            <TabsBar
                {sessions}
                {editingValue}
                onTabSelect={switchToSession}
                onTabEdit={startEditing}
                onTabSave={saveEdit}
                onTabCancel={cancelEdit}
                onTabClose={closeSession}
                onEditValueChange={handleEditValueChange}
                onKeydown={handleKeydown}
                onNewTab={createNewSession}
            />
        {/if}

        <!-- Terminal Body -->
        <div class={cn('bg-background', minimized ? 'hidden' : 'block')}>
            {#each sessions as session (session.id)}
                <div
                    class={cn(
                        'terminal-session h-full w-full',
                        session.active ? 'block' : 'hidden'
                    )}
                    data-session-id={session.id}
                >
                    <Terminal
                        class="min-h-[30vh] max-h-[50vh] scroll-pb-10"
                        sessionId={session.id}
                        onPtyCreated={(ptyProcess) => setPtyProcess(session.id, ptyProcess)}
                    />
                </div>
            {/each}
        </div>
    </div>

    <!-- Toolbar Actions Bar -->
    <div
        class={cn(
            'flex flex-row items-center gap-x-2 bg-background/95 backdrop-blur-md border border-border',
            'shadow-lg transition-all duration-300 ease-out ring-1 ring-ring/5',
            'px-2 py-2 sm:px-4',
            open ? 'rounded-b-xl' : 'rounded-2xl',
            open && !minimized && 'border-t-0 rounded-b-xl'
        )}
    >
        <!-- Drag Handle -->
        <div
            class={cn(
                'flex items-center justify-center p-1 rounded-md cursor-grab hover:bg-muted/50',
                'transition-colors duration-200 select-none',
                isDragging && 'cursor-grabbing bg-muted/70'
            )}
            onmousedown={handleDragStart}
            ondblclick={resetPosition}
            title="Drag to move toolbar • Double-click to reset position • Arrow keys to adjust position"
            role="button"
            tabindex="0"
            aria-label="Drag to move toolbar"
            onkeydown={handleDragKeydown}
        >
            <GripVertical
                size={14}
                class={cn(
                    'text-muted-foreground transition-colors',
                    isDragging && 'text-foreground'
                )}
            />
        </div>

        <!-- Terminal Toggle Button -->
        <Button
            variant="ghost"
            class={cn(
                'rounded-lg gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50',
                'transition-all duration-200 relative flex items-center'
            )}
            onclick={handleToggleTerminal}
        >
            <TerminalIcon size={16} />
            <span class="hidden xs:inline text-sm">Terminal</span>
            <SessionBadge count={sessions.length} />
        </Button>

        <!-- Minimize/Maximize Button (only shown when terminal is open) -->
        {#if open}
            <Button
                variant="ghost"
                size="sm"
                class="rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2 transition-colors duration-200"
                onclick={handleMinimize}
                title={minimized ? 'Maximize Terminal' : 'Minimize Terminal'}
            >
                {#if minimized}
                    <Maximize2 size={14} />
                {:else}
                    <Minimize2 size={14} />
                {/if}
            </Button>
        {/if}

        <!-- Spacer -->
        <div class="flex-1"></div>

        <!-- App Info and Status -->
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <span class="hidden md:inline truncate max-w-32">{appName} v{version}</span>
            <div
                class="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"
                title="Connected"
            ></div>
        </div>
    </div>
</div>

<style>
    /* Terminal session sizing - Tailwind can't handle vh units in responsive design as easily */
    .terminal-session {
        position: relative;
    }

    @media (max-width: 640px) {
        .terminal-session {
            min-height: 25vh;
            max-height: 40vh;
        }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
        .terminal-session {
            min-height: 28vh;
            max-height: 48vh;
        }
    }

    /* Extra small breakpoint for responsive text */
    @media (min-width: 475px) {
        .xs\:inline {
            display: inline;
        }
    }

    /* Enhanced toolbar positioning and shadows following shadcn-svelte patterns */
    .toolbar-container {
        box-shadow:
            0 20px 25px -5px hsl(var(--shadow) / 0.15),
            0 10px 10px -5px hsl(var(--shadow) / 0.1),
            0 4px 6px -2px hsl(var(--shadow) / 0.05);
    }

    /* Ensure toolbar maintains proper size constraints and stays within bounds */
    .toolbar-container {
        min-width: 200px;
        max-width: calc(100vw - 2rem);
        contain: layout;
    }
</style>
