<script lang="ts">
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import { Button, buttonVariants } from '$lib/components/ui/button';

    type Props = {
        open: boolean;
        id: string;
        handleDeleteContainer: () => void;
    };

    let { id, open = $bindable(false), handleDeleteContainer }: Props = $props();
</script>

<Dialog.Root bind:open>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Are you sure about deleting {id} container?</Dialog.Title>
            <Dialog.Description>
                The {id} container is selected for deletion. Any anonymous volumes associated with this
                container are also deleted.
            </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer class="flex flex-row gap-x-4">
            <Dialog.Close class={buttonVariants({ variant: 'secondary' })}>Cancel</Dialog.Close>
            <Button variant="destructive" onclick={handleDeleteContainer}>Delete</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
