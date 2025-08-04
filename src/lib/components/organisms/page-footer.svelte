<script lang="ts">
    import Terminal from '$lib/components/molecules/terminal.svelte';
    import TerminalHeader from '$lib/components/molecules/terminal/header.svelte';
    import TabsBar from '$lib/components/molecules/terminal/tabs-bar.svelte';
    import TerminalPageFooterActions from '$lib/components/molecules/page-footer-actions.svelte';

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

    // Inline editing state
    let editingValue = $state('');

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
        // Find the next available terminal number
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

        // Set all existing sessions to inactive and not editing
        sessions = sessions.map((session) => ({ ...session, active: false, editing: false }));

        // Add new session
        sessions = [...sessions, newSession];
        activeSessionId = newSession.id;
    }

    function switchToSession(sessionId: string) {
        // Don't switch if currently editing
        if (sessions.some((s) => s.editing)) return;

        sessions = sessions.map((session) => ({
            ...session,
            active: session.id === sessionId
        }));
        activeSessionId = sessionId;
    }

    function closeSession(sessionId: string) {
        // Find the session and cleanup its PTY process
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
            // Switch to previous session or first available
            const newActiveIndex = Math.max(0, sessionIndex - 1);
            const newActiveSession = sessions[newActiveIndex];
            switchToSession(newActiveSession.id);
        }
    }

    function startEditing(sessionId: string) {
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
            // Cancel any other editing sessions
            sessions = sessions.map((s) => ({ ...s, editing: false }));

            // Start editing this session
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
</script>

<!-- Terminal Container -->
<div class="flex flex-col ">
    <!-- Terminal Content - Always mounted but visibility controlled -->
    <div
        class="bg-background border border-border rounded-t-xl overflow-hidden transition-all duration-300 shadow-lg {open
            ? minimized
                ? 'opacity-100 translate-y-0 max-h-12 pointer-events-auto'
                : 'opacity-100 translate-y-0 max-h-[52vh] pointer-events-auto'
            : 'opacity-0 translate-y-4 max-h-0 border-0 min-h-0 pointer-events-none'}"
    >
        <!-- Terminal Header -->
        <TerminalHeader
            onClose={handleClose}
            onMinimize={handleMinimize}
            onNewTab={createNewSession}
        />

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
        <div class="bg-background {minimized ? 'hidden' : 'block'}">
            {#each sessions as session (session.id)}
                <div
                    class="terminal-session h-full w-full {session.active ? 'block' : 'hidden'}"
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

    <!-- Footer Bar -->
    <TerminalPageFooterActions
        isOpen={open}
        isMinimized={minimized}
        sessionCount={sessions.length}
        onToggle={handleToggleTerminal}
    />
</div>

<style>
    /*.terminal-session {*/
    /*    min-height: 30vh;*/
    /*    max-height: 40vh;*/
    /*}*/
</style>
