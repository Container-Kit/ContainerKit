import { watchContainerDataDir } from '$lib/services/fs-events/watch';
import { isCreateEvent, isRemoveEvent } from '$lib/services/fs-events/utils';
import type { UnwatchFn, WatchEvent } from '@tauri-apps/plugin-fs';

/**
 * Watch for volume changes in the volumes directory
 * @param callback - Function to call when volume changes occur
 * @param delayMs - Debounce delay in milliseconds
 */
export async function watchVolumeChanges(
    callback: () => void | Promise<void>,
    delayMs: number = 1000
): Promise<UnwatchFn> {
    return watchContainerDataDir(
        'volumes',
        async (event: WatchEvent) => {
            if (isCreateEvent(event) || isRemoveEvent(event)) {
                try {
                    await callback();
                } catch (error) {
                    console.error('Error in volume changes callback:', error);
                }
            }
        },
        delayMs
    );
}
