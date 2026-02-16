<script lang="ts">
    import MoreHorizontal from "@lucide/svelte/icons/more-horizontal";
    import Download from "@lucide/svelte/icons/download";
    import PushToRegistry from "@lucide/svelte/icons/cloud-upload";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { toast } from 'svelte-sonner';
    import { downloadDir } from '@tauri-apps/api/path';
    import { openDynamicDialog } from "$lib/components/molecules/dynamic-dialog.svelte"
    type SaveState = 'none' | 'saving' | 'saved' | 'error';

    type Props = {
        buttonProps: Record<string, unknown>
    };

    let { buttonProps }: Props = $props();

    let saveState: SaveState = $state('none')

    const saveImage = () => {
        // container i save --arch aarch64 --output /Users/shivammeena/Projects/ContainerKit/static/test-tar.tar redis
        openDynamicDialog({
            title: 'Save Image',
            description: 'This will save the image as a tar archive. Do you want to proceed?',
            text: {
                confirm: 'Yes, Save',
                cancel: 'No, Cancel'
            },
            onConfirm: async () => {
                saveState = 'saving';
                try {
                    const downloadsPath = await downloadDir();
                    // Implement the logic to save/download the image to downloadsPath
                    console.log(`Saving image to ${downloadsPath}`);
                    // Simulate saving process
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    saveState = 'saved';
                    toast.success('Image saved successfully.');
                } catch (error) {
                    saveState = 'error';
                    toast.error('Failed to save the image.', {
                        description: error instanceof Error ? error.message : String(error)
                    });
                }
            }
        });
    };
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger {...buttonProps}>
        <MoreHorizontal />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-40" align="end" side="right">
        <DropdownMenu.Label>Image Actions</DropdownMenu.Label>
        <DropdownMenu.Group>
            <DropdownMenu.Item disabled>
                <Download /> Inspect Image
            </DropdownMenu.Item>
            <DropdownMenu.Item disabled>
                <Download /> Tag Image
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onSelect={saveImage} disabled={saveState === 'saving'}>
                <Download /> Export as TAR
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={saveImage} disabled>
                <PushToRegistry /> Push to Registry
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>