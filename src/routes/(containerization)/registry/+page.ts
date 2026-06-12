import type { PageLoad } from './$types';
import type { Registry } from '$lib/models/container';
import { getDefaultRegistry } from '$lib/services/containerization/registry/default';

// Well-known registries; the CLI itself only tracks the default one
const registries: Registry[] = [
    { name: 'Docker', url: 'docker.io' },
    { name: 'GitHub', url: 'ghcr.io' }
];

export const load: PageLoad = async () => {
    const defaultRegistry = await getDefaultRegistry();
    return {
        registries,
        defaultRegistry: defaultRegistry.ok ? defaultRegistry.data : null
    };
};
