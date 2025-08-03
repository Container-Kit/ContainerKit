<script lang="ts">
    import { Badge } from '$lib/components/ui/badge';
    import { cn } from '$lib/utils';

    interface SessionBadgeProps {
        count: number;
        class?: string;
    }

    let { count, class: className }: SessionBadgeProps = $props();
</script>

{#if count > 0}
    <Badge variant="secondary" class={cn('text-xs', className)}>
        {count}
    </Badge>
{/if}
