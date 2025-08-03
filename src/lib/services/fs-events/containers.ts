import { watchContainerDataDir } from '$lib/services/fs-events/watch';
import { isCreateEvent, isRemoveEvent, isDataModifyEvent } from '$lib/services/fs-events/utils';
import type { UnwatchFn, WatchEvent } from '@tauri-apps/plugin-fs';

/**
 * Watch for container changes (create, remove, or modify events)
 * @param callback - Function to call when container changes occur
 * @param delayMs - Debounce delay in milliseconds
 */
export async function watchContainerChanges(
    callback: () => void | Promise<void>,
    delayMs: number = 2000
): Promise<UnwatchFn> {
    return watchContainerDataDir(
        'containers',
        async (event: WatchEvent) => {
            if (isCreateEvent(event) || isRemoveEvent(event) || isDataModifyEvent(event)) {
                try {
                    await callback();
                } catch (error) {
                    console.error('Error in container changes callback:', error);
                }
            }
        },
        delayMs
    );
}
