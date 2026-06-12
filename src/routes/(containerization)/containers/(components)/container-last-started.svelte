<script lang="ts">
    type Props = {
        // ISO date string from `status.startedDate`; absent while stopped
        lastStarted?: string;
    };

    let { lastStarted }: Props = $props();

    let timeAgo = $state('');

    function updateAgo(): void {
        const timestamp = lastStarted ? Date.parse(lastStarted) : NaN;
        if (isNaN(timestamp)) {
            timeAgo = 'N/A';
            return;
        }

        const date = new Date(timestamp);
        const now = new Date();
        let delta = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (delta < 0) {
            timeAgo = 'Just now';
            return;
        }

        const days = Math.floor(delta / 86400);
        delta -= days * 86400;

        const hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        const minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        const seconds = Math.floor(delta % 60);

        if (days > 0) {
            timeAgo = `${days}d ago`;
        } else if (hours > 0) {
            timeAgo = `${hours}h ago`;
        } else if (minutes > 0) {
            timeAgo = `${minutes}m ago`;
        } else {
            timeAgo = `1m ago`;
        }
    }

    $effect(() => {
        updateAgo();
        const interval = setInterval(updateAgo, 1000);
        return () => clearInterval(interval);
    });
</script>

<span
    class="w-fit"
    style="font-variant-numeric: tabular-nums; display: inline-block; min-width: 80px;"
>
    {timeAgo}
</span>
