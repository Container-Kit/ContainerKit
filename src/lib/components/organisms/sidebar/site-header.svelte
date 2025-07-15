<script lang="ts">
    import * as Breadcrumb from '$lib/components/ui/breadcrumb';
    import { Separator } from '$lib/components/ui/separator';
    import * as Sidebar from '$lib/components/ui/sidebar';

    let { route }: { route: string } = $props();

    let title = $derived(route.replace('/', ''));
</script>

<header
    class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
>
    <div class="flex items-center gap-2 px-4">
        <Sidebar.Trigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Page class="first-letter:capitalize tracking-wider">
                        {title === '' ? 'Containers' : title}
                    </Breadcrumb.Page>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
    </div>
</header>
