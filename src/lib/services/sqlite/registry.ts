import { db } from '$lib/db';
import { registry } from '$lib/db/schema';
import type { InsertRegistry } from '$lib/models/container';

export async function addRegistry(registryData: InsertRegistry) {
    return db.insert(registry).values(registryData);
};