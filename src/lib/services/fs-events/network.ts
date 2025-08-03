import { watchContainerDataDir } from '$lib/services/fs-events/watch';
import { isCreateEvent, isDataModifyEvent, isRemoveEvent } from '$lib/services/fs-events/utils';
import type { UnwatchFn, WatchEvent } from '@tauri-apps/plugin-fs';

/**
 * Watch for network changes in the networks directory
 * @param callback - Function to call when network changes occur
 * @param delayMs - Debounce delay in milliseconds
 */
export async function watchNetworkChanges(
    callback: () => void | Promise<void>,
    delayMs: number = 1000
): Promise<UnwatchFn> {
    return watchContainerDataDir(
        'networks',
        async (event: WatchEvent) => {
            if (isCreateEvent(event) || isRemoveEvent(event)) {
                try {
                    await callback();
                } catch (error) {
                    console.error('Error in network changes callback:', error);
                }
            }
        },
        delayMs
    );
}
