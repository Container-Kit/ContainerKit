<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar";
    import { page } from "$app/state";
    import {useSidebar} from "$lib/components/ui/sidebar";
    type Props = {
        label: string;
        data: {
            name: string;
            url: string;
            // This should be `Component` after @lucide/svelte updates types
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            icon: any;
        }[];
    };

    let { data, label }: Props = $props();
</script>

<Sidebar.Group>
    <Sidebar.GroupLabel>{label}</Sidebar.GroupLabel>
    <Sidebar.Menu>
        {#each data as item (item.name)}
            <Sidebar.MenuItem>
                <Sidebar.MenuButton isActive={item.url === page?.url.pathname} tooltipContent={item.name} tooltipContentProps={{
                    "class": "bg-primary"
                }}>
                    {#snippet child({ props })}
                        <a href={item.url} {...props}>
                            <item.icon />
                            <span>{item.name}</span>
                        </a>
                    {/snippet}
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
        {/each}
    </Sidebar.Menu>
</Sidebar.Group>
