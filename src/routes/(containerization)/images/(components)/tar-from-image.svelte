<script lang="ts">
    import DynamicDialog from "$lib/components/molecules/dynamic-dialog.svelte";
</script>

<DynamicDialog>
    <div class="flex flex-col gap-y-4">
        <p>
            This image is not available locally. Do you want to pull it from the registry and create a tarball from it?
        </p>
    </div>
</DynamicDialog>