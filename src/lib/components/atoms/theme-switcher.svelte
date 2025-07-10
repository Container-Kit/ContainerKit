<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Sidebar from "$lib/components/ui/sidebar";
    import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
    import PlusIcon from "@lucide/svelte/icons/plus";
    import PaintBucket from "@lucide/svelte/icons/paint-bucket";
    import SwatchBook from "@lucide/svelte/icons/swatch-book";

    let { themes, setTheme }: { themes: { name: string; class: string; title: string;}[], setTheme: (theme: string) => void } = $props();

    let activeTheme = $state(themes[0]);
</script>

<Sidebar.Menu>
    <Sidebar.MenuItem>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Sidebar.MenuButton
                            {...props}
                            size="lg"
                            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div
                                class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                        >
                            <SwatchBook class="size-4" />
                        </div>
                        <div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">
								Themes
							</span>
                            <span class="truncate text-xs">{activeTheme.title}</span>
                        </div>
                        <ChevronsUpDownIcon class="ml-auto" />
                    </Sidebar.MenuButton>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
                    class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
                    align="start"
                    side="top"
                    sideOffset={4}
            >
                <DropdownMenu.Label class="text-muted-foreground text-xs">Themes</DropdownMenu.Label>
                {#each themes as theme, index (theme.name)}
                    <DropdownMenu.Item disabled={activeTheme.name === theme.name} onSelect={() => {activeTheme = theme; setTheme(theme.name)}} class="gap-2 p-2">
                        <div class="flex size-6 items-center justify-center rounded-md border">
                            <PaintBucket class={[
                                    "size-3.5 shrink-0", theme.class
                                ]} />
                        </div>
                        {theme.title}
                        <DropdownMenu.Shortcut>⌘T{index + 1}</DropdownMenu.Shortcut>
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </Sidebar.MenuItem>
</Sidebar.Menu>