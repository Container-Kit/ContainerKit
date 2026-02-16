<script lang="ts" module>
    import type { Snippet } from 'svelte';
    /**
     * Limitation: This dynamic dialog implementation supports only one dialog at a time.
     * If multiple dialogs are needed simultaneously, consider implementing a new component in the future.
     * */
    class DynamicDialogState {
        show = $state(false);
        options = $state<DynamicDialogOptions | null>(null);
        constructor() {
            this.confirm = this.confirm.bind(this);
            this.cancel = this.cancel.bind(this);
        }

        newDialog(options: DynamicDialogOptions) {
            this.reset();
            this.options = options;
            this.show = true;
        }

        confirm() {
            this.options?.onConfirm().then(() => {
                this.show = false;
            });
        }

        reset() {
            this.show = false;
            this.options = null;
        }

        cancel() {
            this.options?.onCancel?.();
            this.show = false;
        }
    }

    const dialogState = new DynamicDialogState();

    export type DynamicDialogOptions = {
        title: string;
        description?: string;
        confirm: {
            action: () => Promise<unknown>;
            text?: string;
            variant?: ButtonVariant;
        };
        cancel?: {
            text?: string;
            action?: () => void;
            variant?: ButtonVariant;
        };
        onConfirm: () => Promise<unknown>;
        onCancel?: () => void;
    };

    export type DynamicDialogProps = {
        children: Snippet;
    };

    export const openDynamicDialog = (options: DynamicDialogOptions) => {
        dialogState.newDialog(options);
    };
</script>

<script lang="ts">
    import { Button, buttonVariants, type ButtonVariant } from '$lib/components/ui/button';
    import * as Dialog from "$lib/components/ui/dialog/index.js";

    const { children }: DynamicDialogProps = $props();
</script>

<Dialog.Root bind:open={dialogState.show}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>{dialogState.options?.title}</Dialog.Title>
            {#if dialogState.options?.description}
                <Dialog.Description>
                    {dialogState.options?.description}
                </Dialog.Description>
            {/if}
        </Dialog.Header>
        {#if children}
            {@render children()}
        {/if}
        <Dialog.Footer>
            <Dialog.Close class={buttonVariants({ variant: "secondary" })} onclick={dialogState.cancel}>{dialogState.options?.cancel?.text ?? "Close"}</Dialog.Close>
            <Button variant={dialogState.options?.confirm?.variant ?? 'default'}>{dialogState.options?.confirm?.text ?? 'Save'}</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>