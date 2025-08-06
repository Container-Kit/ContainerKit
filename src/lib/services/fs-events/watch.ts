import { BaseDirectory, type UnwatchFn, watch, type WatchEvent } from '@tauri-apps/plugin-fs';
import { CONTAINER_APP_DATA_DIR } from '$lib/helpers/constants';

/**
 * Create a managed watcher that automatically tracks itself for cleanup
 */
async function createManagedWatcher(
    relativePath: string,
    callback: (event: WatchEvent) => void | Promise<void>,
    delayMs: number,
    recursive: boolean = false,
    baseDirectory?: BaseDirectory,
): Promise<UnwatchFn> {
    try {
        const unwatchFn = watch(
            relativePath,
            async (event) => {
                try {
                    await callback(event);
                } catch (error) {
                    console.error(`Error in watcher callback for ${relativePath}:`, error);
                }
            },
            {
                baseDir: baseDirectory,
                delayMs,
                recursive
            }
        );
        return unwatchFn;
    } catch (error) {
        console.error(`Failed to create watcher for ${relativePath}:`, error);
        throw error;
    }
}

/**
 * Watch a directory or file in the container app data directory
 * @param path - Path relative to app dir (shouldn't start with /)
 * @param callback - Callback function executed when event fires
 * @param delayMs - Debounce delay in milliseconds
 */
export async function watchContainerDataDir(
    path: string,
    callback: (event: WatchEvent) => void | Promise<void>,
    delayMs: number = 1000,
    recursive: boolean = false
): Promise<UnwatchFn> {
    const fullPath = `${CONTAINER_APP_DATA_DIR}/${path}`;
    return createManagedWatcher(fullPath, callback, delayMs, recursive, BaseDirectory.Data);
}

/**
 * Watch a directory or file in the container app data directory
 * @param path - Path relative to app dir (shouldn't start with /)
 * @param callback - Callback function executed when event fires
 * @param delayMs - Debounce delay in milliseconds
 */
export async function watchDnsResolverDir(
    callback: (event: WatchEvent) => void | Promise<void>,
    delayMs: number = 1000,
    recursive: boolean = false
): Promise<UnwatchFn> {
    const relativePath = `/etc/resolver`;
    return createManagedWatcher(relativePath, callback, delayMs, recursive);
}