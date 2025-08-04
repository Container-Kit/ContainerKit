import { BaseDirectory, watch, type WatchEvent, type UnwatchFn } from '@tauri-apps/plugin-fs';
import { CONTAINER_APP_DATA_DIR } from '$lib/helpers/constants';

/**
 * Create a managed watcher that automatically tracks itself for cleanup
 */
async function createManagedWatcher(
    fullPath: string,
    callback: (event: WatchEvent) => void | Promise<void>,
    delayMs: number,
    recursive: boolean = false
): Promise<UnwatchFn> {
    try {
        const unwatchFn = watch(
            fullPath,
            async (event) => {
                try {
                    await callback(event);
                } catch (error) {
                    console.error(`Error in watcher callback for ${fullPath}:`, error);
                }
            },
            {
                baseDir: BaseDirectory.Data,
                delayMs,
                recursive
            }
        );

        return unwatchFn;
    } catch (error) {
        console.error(`Failed to create watcher for ${fullPath}:`, error);
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
    return createManagedWatcher(fullPath, callback, delayMs, recursive);
}
