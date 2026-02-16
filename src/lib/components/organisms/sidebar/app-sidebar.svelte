<script lang="ts" module>
    import Container from '@lucide/svelte/icons/container';
    import Image from '@lucide/svelte/icons/image';
    import Volume from '@lucide/svelte/icons/database';
    import Hammer from '@lucide/svelte/icons/hammer';
    import WayPoints from '@lucide/svelte/icons/waypoints';
    import Network from '@lucide/svelte/icons/network';
    import BigLibrary from '@lucide/svelte/icons/library-big';
    import Cog from '@lucide/svelte/icons/cog';
    import Moon from '@lucide/svelte/icons/moon';
    import Sun from '@lucide/svelte/icons/sun';
    import { themes } from '$lib/helpers/themes-data.js';
    const data = {
        themes,
        pages: [
            {
                name: 'Containers',
                url: '/containers',
                icon: Container,
                isActive: false
            },
            {
                name: 'Images',
                url: '/images',
                icon: Image,
                isActive: false
            },
            {
                name: 'Volumes',
                url: '/volumes',
                icon: Volume,
                isActive: false
            },
            {
                name: 'Builder',
                url: '/builder',
                icon: Hammer,
                isActive: false
            },
            {
                name: 'DNS',
                url: '/dns',
                icon: WayPoints,
                isActive: false
            },
            {
                name: 'Network',
                url: '/network',
                icon: Network,
                isActive: false
            },
            {
                name: 'Registry',
                url: '/registry',
                icon: BigLibrary,
                isActive: false
            }
        ]
    };
</script>

<script lang="ts">
    import NavGroup from './nav-group.svelte';
    import * as Sidebar from '$lib/components/ui/sidebar';
    import type { ComponentProps } from 'svelte';
    import { mode, setMode, setTheme } from 'mode-watcher';
    import { PressedKeys } from 'runed';
    import { page } from '$app/state';

    let {
        ref = $bindable(null),
        collapsible = 'icon',
        ...restProps
    }: ComponentProps<typeof Sidebar.Root> = $props();

    const keys = new PressedKeys();

    keys.onKeys(['meta', 'l'], () => {
        handleModeChange();
    });

    data.themes.forEach((theme, index) => {
        keys.onKeys(['meta', 't', (index + 1).toString()], () => {
            setTheme(theme.name);
        });
    });

    function updateTheme() {
        setMode(mode.current === 'light' ? 'dark' : 'light');
    }

    async function handleModeChange() {
        document.documentElement.style.viewTransitionName = 'theme-transition';
        await document.startViewTransition(updateTheme).finished;
        document.documentElement.style.viewTransitionName = '';
    }
</script>

<Sidebar.Root {collapsible} {...restProps}>
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <Sidebar.MenuButton
                    class="hover:bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group/logo"
                    size="lg"
                >
                    <div
                        class="flex aspect-square size-8 items-center justify-center rounded-lg bg-secondary-foreground"
                    >
                        <img
                            src="/logo.png"
                            class="rounded-xs scale-125 transform-3d transition-all duration-500 group-hover/logo:scale-150"
                            alt="container kit logo"
                        />
                    </div>
                    <span class="font-mono text-xl text-primary">ContainerKit</span>
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
        <NavGroup data={data.pages} label="Main" />
    </Sidebar.Content>
    <Sidebar.Footer>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <Sidebar.MenuButton
                    isActive={'/settings' === page?.url.pathname}
                    tooltipContent="Settings"
                    tooltipContentProps={{
                        class: 'bg-primary'
                    }}
                >
                    {#snippet child({ props })}
                        <a href="/settings" {...props}>
                            <Cog />
                            <span>Settings</span>
                        </a>
                    {/snippet}
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
                <Sidebar.MenuButton onclick={handleModeChange}>
                    {#if mode.current === 'dark'}
                        <Moon class="h-5 w-5" />
                    {:else}
                        <Sun class="h-6 w-[1.3rem]" />
                    {/if}
                    <span class="sr-only">Toggle theme</span>
                    <span>{mode.current === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Footer>
</Sidebar.Root>
