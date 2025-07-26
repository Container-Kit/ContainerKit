import type { PageLoad } from './$types';
import { db } from '$lib/db';
import { getDefaultRegistry } from '$lib/services/containerization/registry/default';

export const load: PageLoad = async () => {

    const [registries, defaultRegistry] = await Promise.all([await db.query.registry.findMany(), getDefaultRegistry()])
    return {
        registries,
        defaultRegistry: defaultRegistry.error ? null : defaultRegistry.stdout,
    };
};
