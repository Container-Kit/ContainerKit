<script lang="ts" module>
    import Container from "@lucide/svelte/icons/container";
    import Image from "@lucide/svelte/icons/image";
    import Hammer from "@lucide/svelte/icons/hammer";
    import WayPoints from "@lucide/svelte/icons/waypoints";
    import Network from "@lucide/svelte/icons/network";
    import Warehouse from "@lucide/svelte/icons/warehouse";
    const data = {
        themes: [
            {
                class: "text-[#171717] dark:text-[#e5e5e5]",
                title: "Default",
                name: ''
            },
            {
                class: "text-[#e05d38] dark:text-[#e05d38]",
                title: "Tangerine",
                name: "tangerine",
            },
            {
                class: "text-[#06858e] dark:text-[#4de8e8]",
                title: "Perpetuity",
                name: "perpetuity",
            },
            {
                class: "text-[#6e56cf] dark:text-[#a48fff]",
                title: "Cosmic Night",
                name: "cosmic-night",
            },
            {
                class: "text-[#3b82f6] dark:text-[#3b82f6]",
                title: "Modern Minimal",
                name: "modern-minimal",
            },
            {
                class: "text-[#a84370] dark:text-[#a3004c]",
                title: "T3 Chat",
                name: "t3-chat",
            },
            {
                class: "text-[#3a5ba0] dark:text-[#3a5ba0]",
                title: "Starry Night",
                name: "starry-night",
            }
        ],
        containers: [
            {
                name: "Containers",
                url: "/containers",
                icon: Container,
                isActive: false,
            },
            {
                name: "Images",
                url: "/images",
                icon: Image,
                isActive: false,
            },
            {
                name: "Builder",
                url: "/builder",
                icon: Hammer,
                isActive: false,
            },
            {
                name: "DNS",
                url: "/dns",
                icon: WayPoints,
                isActive: false,
            },
            {
                name: "Network",
                url: "/network",
                icon: Network,
                isActive: false,
            },
            {
                name: "Registry",
                url: "/registry",
                icon: Warehouse,
                isActive: false,
            },
        ],
    };
</script>

<script lang="ts">
    import NavGroup from "./nav-group.svelte";
    import * as Sidebar from "$lib/components/ui/sidebar";
    import type { ComponentProps } from "svelte";
    import ThemeSwitcher from "$lib/components/atoms/theme-switcher.svelte";
    import {mode, setMode, setTheme} from "mode-watcher";
    import Moon from "@lucide/svelte/icons/moon";
    import Sun from "@lucide/svelte/icons/sun";
    import {PressedKeys} from "runed";

    let {
        ref = $bindable(null),
        collapsible = "icon",
        ...restProps
    }: ComponentProps<typeof Sidebar.Root> = $props();


    const keys = new PressedKeys();

    keys.onKeys(["meta", "l"], () => {
        handleModeChange()
    })

    data.themes.forEach((theme, index) => {
        keys.onKeys(["meta", "t", (index+1).toString()], () => {
            setTheme(theme.name)
        });
    })


    function updateTheme() {
        setMode( mode.current === 'light' ? 'dark' : 'light' );
    }

    async function handleModeChange() {
        document.documentElement.style.viewTransitionName = 'theme-transition';
        await document.startViewTransition( updateTheme ).finished;
        document.documentElement.style.viewTransitionName = '';
    }
</script>

<Sidebar.Root {collapsible} {...restProps}>
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <Sidebar.MenuButton
                        class="hover:bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group"
                        size="lg"
                >
                    <div
                            class="flex aspect-square size-8 items-center justify-center rounded-lg bg-secondary-foreground"
                    >
                        <img src="/logo.png" class="rounded-xs scale-125 transform-3d transition-all duration-500 group-hover:scale-150" />
                    </div>
                    <span class="font-mono text-xl text-primary">AniHour</span>
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
        <NavGroup data={data.containers} label="Main" />
    </Sidebar.Content>
    <Sidebar.Footer>
        <ThemeSwitcher themes={data.themes} {setTheme}/>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <Sidebar.MenuButton onclick={handleModeChange}>
                    {#if mode.current === 'light'}
                        <Moon class="h-5 w-5"/>
                    {:else}
                        <Sun class="h-6 w-[1.3rem]"/>
                    {/if}
                    <span class="sr-only">Toggle theme</span>
                    <span>{mode.current === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Footer>
</Sidebar.Root>
