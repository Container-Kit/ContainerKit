<script lang="ts">
    import { Badge } from '$lib/components/ui/badge';
    import Circle from '@lucide/svelte/icons/circle';
    type Props = {
        status: 'running' | 'stopped';
    };

    let { status }: Props = $props();

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'running':
                return {
                    variant: 'secondary' as const,
                    color: 'text-green-500',
                    label: 'Running'
                };
            case 'stopped':
                return {
                    variant: 'outline' as const,
                    color: 'text-red-500',
                    label: 'Stopped'
                };
            default:
                return {
                    variant: 'secondary' as const,
                    color: 'text-gray-500',
                    label: 'Unknown'
                };
        }
    };

    const config = $derived.by(() => getStatusConfig(status));
</script>

<Badge variant={config.variant} class={['flex items-center gap-1']}>
    <Circle class={`h-2 w-2 fill-current ${config.color}`} />
    <span>{config.label}</span>
</Badge>
