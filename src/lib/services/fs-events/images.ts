import { watchContainerDataDir } from '$lib/services/fs-events/watch';
import { isDataModifyEvent } from '$lib/services/fs-events/utils';
import type { UnwatchFn, WatchEvent } from '@tauri-apps/plugin-fs';

/**
 * Watch for image changes in the state.json file
 * @param callback - Function to call when image changes occur
 * @param delayMs - Debounce delay in milliseconds
 */
export async function watchImageChanges(
    callback: () => void | Promise<void>,
    delayMs: number = 2000
): Promise<UnwatchFn> {
    return watchContainerDataDir(
        'state.json',
        async (event: WatchEvent) => {
            if (isDataModifyEvent(event)) {
                try {
                    await callback();
                } catch (error) {
                    console.error('Error in image changes callback:', error);
                }
            }
        },
        delayMs
    );
}
