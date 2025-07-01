<script lang="ts" module>
    import AudioWaveformIcon from "@lucide/svelte/icons/audio-waveform";
    import CommandIcon from "@lucide/svelte/icons/command";
    import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
    import Container from "@lucide/svelte/icons/container";
    import Image from "@lucide/svelte/icons/image";
    // This is sample data.
    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        teams: [
            {
                name: "Acme Inc",
                logo: GalleryVerticalEndIcon,
                plan: "Enterprise",
            },
            {
                name: "Acme Corp.",
                logo: AudioWaveformIcon,
                plan: "Startup",
            },
            {
                name: "Evil Corp.",
                logo: CommandIcon,
                plan: "Free",
            },
        ],
        containers: [
            {
                name: "Containers",
                url: "/",
                icon: Container,
                isActive: false,
            },
            {
                name: "Images",
                url: "/images",
                icon: Image,
                isActive: false,
            },
        ],
    };
</script>

<script lang="ts">
    import NavGroup from "./nav-group.svelte";
    import NavUser from "./nav-user.svelte";
    import TeamSwitcher from "../../atoms/team-switcher.svelte";
    import * as Sidebar from "$lib/components/ui/sidebar";
    import type { ComponentProps } from "svelte";

    let {
        ref = $bindable(null),
        collapsible = "icon",
        ...restProps
    }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
    <Sidebar.Header>
        <TeamSwitcher teams={data.teams} />
    </Sidebar.Header>
    <Sidebar.Content>
        <NavGroup data={data.containers} label="Main" />
    </Sidebar.Content>
    <Sidebar.Footer>
<!--        <NavUser user={data.user} />-->
    </Sidebar.Footer>
</Sidebar.Root>
