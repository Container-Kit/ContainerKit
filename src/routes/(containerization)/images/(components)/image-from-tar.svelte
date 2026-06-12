<script lang="ts">
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import * as Alert from '$lib/components/ui/alert/index.js';
    import { open } from '@tauri-apps/plugin-dialog';
    import { Button } from '$lib/components/ui/button';
    import UploadIcon from '@lucide/svelte/icons/upload';
    import CircleAlert from '@lucide/svelte/icons/circle-alert';
    import Loader from '@lucide/svelte/icons/loader';
    import { toast } from 'svelte-sonner';
    import { slide } from 'svelte/transition';
    import { importImageFromTar } from '$lib/services/containerization/images';

    type Props = {
        show: boolean;
    };

    let { show = $bindable(false) }: Props = $props();

    let states = $state({
        error: '',
        importing: false
    });

    async function selectFilePath() {
        const file = await open({
            multiple: false,
            directory: false
        });

        if (!file) {
            states.error = 'No file selected.';
            return toast.error('No selected file', {
                description: 'You need to select a image tar archive.'
            });
        }
        states.importing = true;
        const importPromise = importImageFromTar(file).then((result) => {
            if (!result.ok) throw new Error(result.error);
        });
        toast.promise(importPromise, {
            position: 'top-right',
            loading: 'Importing image from tar archive...',
            success: () => {
                return 'Image imported successfully!';
            },
            error: () => {
                states.error = 'Failed to import image from tar archive.';
                return states.error;
            },
            finally: () => {
                states.importing = false;
                show = false;
            }
        });
    }

    // container i save --arch aarch64 --output /Users/shivammeena/Projects/ContainerKit/static/test-tar.tar redis

    function onOpenChange(value: boolean) {
        show = value;
        if (!value) {
            states.error = '';
        }
    }
</script>

<Dialog.Root open={show} {onOpenChange}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Import Image Tar Archive</Dialog.Title>
            <Dialog.Description>Load images from an OCI compatible tar archive</Dialog.Description>
            {#if states.error}
                <div class="flex flex-col" transition:slide>
                    <Alert.Root variant="warning">
                        <CircleAlert />
                        <Alert.Title>{states.error}</Alert.Title>
                    </Alert.Root>
                </div>
            {/if}
        </Dialog.Header>
        <Button
            variant="ghost"
            disabled={states.importing}
            onclick={selectFilePath}
            class="border-border hover:bg-accent/25 flex h-48 w-full place-items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all hover:cursor-pointer aria-disabled:opacity-50 aria-disabled:hover:cursor-not-allowed"
        >
            <div class="flex flex-col place-items-center justify-center gap-2">
                <div
                    class="border-border text-muted-foreground flex size-14 place-items-center justify-center rounded-full border border-dashed"
                >
                    {#if states.importing}
                        <Loader class="size-7 animate-spin" />
                    {:else}
                        <UploadIcon class="size-7" />
                    {/if}
                </div>
                <div class="flex flex-col gap-0.5 text-center">
                    <span class="text-muted-foreground font-medium">
                        {#if states.importing}
                            Loading...
                        {:else}
                            Click to select image tar archive
                        {/if}
                    </span>
                </div>
            </div>
        </Button>
    </Dialog.Content>
</Dialog.Root>
