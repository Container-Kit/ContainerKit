<script lang="ts">
    import * as Drawer from '$lib/components/ui/drawer/index.js';
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import Container from '@lucide/svelte/icons/container';
    import Logs from './container-details/logs.svelte';
    import Inspect from './container-details/inspect.svelte';
    import { tabs, type Tabs as TabsType } from './container-details/utils';
    import type { Component } from 'svelte';
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import Terminal from "$lib/components/molecules/terminal.svelte"

    type Props = {
        open: boolean;
        id: string;
        activeTab?: string;
    };

    let { open = $bindable(false), id, activeTab = $bindable(tabs[0].value) }: Props = $props();

    const componentMap: Record<TabsType[number]['label'], Component<any>> = {
        logs: Logs,
        inspect: Inspect,
        terminal: Terminal
    };
</script>

<Drawer.Root bind:open direction="right">
    <Drawer.Content class="min-w-[66%] @container/drawer rounded-lg h-full">
        <Drawer.Header>
            <Drawer.Title class="flex flex-row items-center gap-x-2">
                <Container />
                <span class="capitalize font-bold text-2xl">{id}</span>
            </Drawer.Title>
            <Drawer.Description>Know more about your container</Drawer.Description>
        </Drawer.Header>
        <Tabs.Root bind:value={activeTab} class="p-4">
            <Tabs.List>
                {#each tabs as tab (tab.label)}
                    <Tabs.Trigger value={tab.value}>{tab.label}</Tabs.Trigger>
                {/each}
            </Tabs.List>
            {#if open}
                <Tabs.Content value={activeTab} class="w-full h-[120vh] p-2">
                    {#if activeTab === 'terminal'}
                        <div class="w-full h-[86%]">
                            <Terminal class="h-full w-full" container={id}/>
                        </div>
                    {:else }
                        {@const ActiveTabComponent = componentMap[activeTab]}
                        <ScrollArea class="w-full rounded-3xl h-5/6 pr-3" orientation="vertical">
                            <ActiveTabComponent {id} class="h-full w-full" />
                        </ScrollArea>
                    {/if}
                </Tabs.Content>
            {/if}
        </Tabs.Root>
    </Drawer.Content>
</Drawer.Root>
