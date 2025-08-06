import { watchContainerDataDir, watchDnsResolverDir } from '$lib/services/fs-events/watch';
import { isDataModifyEvent, isCreateEvent, isRemoveEvent } from '$lib/services/fs-events/utils';
import type { UnwatchFn, WatchEvent } from '@tauri-apps/plugin-fs';

/**
 * Watch for DNS configuration changes
 * @param callback - Function to call when DNS changes occur
 * @param delayMs - Debounce delay in milliseconds
 */
export async function watchDnsChanges(
    callback: () => void | Promise<void>,
    delayMs: number = 1000
): Promise<UnwatchFn> {
    return watchContainerDataDir(
        'dns',
        async (event: WatchEvent) => {
            if (isDataModifyEvent(event) || isCreateEvent(event) || isRemoveEvent(event)) {
                try {
                    await callback();
                } catch (error) {
                    console.error('Error in DNS changes callback:', error);
                }
            }
        },
        delayMs
    );
}

/**
 * Watch for DNS resolver configuration changes
 * @param callback - Function to call when DNS resolver changes occur
 * @param delayMs - Debounce delay in milliseconds
 */
export async function watchDnsResolverChanges(
    callback: (event: WatchEvent) => void | Promise<void>,
    delayMs: number = 1000
): Promise<UnwatchFn> {
    return watchDnsResolverDir(
        async (event: WatchEvent) => {
            console.log('DNS changes callback:', event);
            if (isDataModifyEvent(event) || isCreateEvent(event) || isRemoveEvent(event)) {
                try {
                    await callback(event);
                } catch (error) {
                    console.error('Error in DNS resolver callback:', error);
                }
            }
        },
        delayMs
    );
}
