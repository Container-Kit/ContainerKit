import { type WatchEvent } from '@tauri-apps/plugin-fs';

/**
 * Type guard to check if the event is a modify event with data kind.
 * This helps TypeScript properly narrow the WatchEvent union type.
 */
export function isDataModifyEvent(event: WatchEvent): event is WatchEvent & {
    type: { modify: { kind: 'data' } };
} {
    return (
        event &&
        typeof event.type === 'object' &&
        event.type !== null &&
        'modify' in event.type &&
        typeof event.type.modify === 'object' &&
        event.type.modify !== null &&
        'kind' in event.type.modify &&
        event.type.modify.kind === 'data'
    );
}

/**
 * Type guard to check if the event is a modify event with metadata kind.
 */
export function isMetadataModifyEvent(event: WatchEvent): event is WatchEvent & {
    type: { modify: { kind: 'metadata' } };
} {
    return (
        event &&
        typeof event.type === 'object' &&
        event.type !== null &&
        'modify' in event.type &&
        typeof event.type.modify === 'object' &&
        event.type.modify !== null &&
        'kind' in event.type.modify &&
        event.type.modify.kind === 'metadata'
    );
}

/**
 * Type guard to check if the event is any modify event (data or metadata).
 */
export function isModifyEvent(event: WatchEvent): event is WatchEvent & {
    type: { modify: { kind: string } };
} {
    return (
        event &&
        typeof event.type === 'object' &&
        event.type !== null &&
        'modify' in event.type &&
        typeof event.type.modify === 'object' &&
        event.type.modify !== null &&
        'kind' in event.type.modify
    );
}

/**
 * Type guard to check if the event is a create event.
 */
export function isCreateEvent(event: WatchEvent): event is WatchEvent & {
    type: { create: { kind: string } };
} {
    return (
        event &&
        typeof event.type === 'object' &&
        event.type !== null &&
        'create' in event.type &&
        typeof event.type.create === 'object' &&
        event.type.create !== null
    );
}

/**
 * Type guard to check if the event is a remove event.
 */
export function isRemoveEvent(event: WatchEvent): event is WatchEvent & {
    type: { remove: { kind: string } };
} {
    return (
        event &&
        typeof event.type === 'object' &&
        event.type !== null &&
        'remove' in event.type &&
        typeof event.type.remove === 'object' &&
        event.type.remove !== null
    );
}

/**
 * Type guard to check if the event is an access event.
 */
export function isAccessEvent(event: WatchEvent): event is WatchEvent & {
    type: { access: { kind: string } };
} {
    return (
        event &&
        typeof event.type === 'object' &&
        event.type !== null &&
        'access' in event.type &&
        typeof event.type.access === 'object' &&
        event.type.access !== null
    );
}
