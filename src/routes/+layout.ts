import { isUnsupported } from '$lib/stores/mac-os.svelte';
import { redirect } from '@sveltejs/kit';

export const prerender = true;
export const ssr = false;

export const load = async ({ url }) => {
    if (isUnsupported() && url.pathname !== '/unsupported') {
        return redirect(301, '/unsupported');
    }

    if (url.pathname === '/') {
        return redirect(301, '/containers');
    }
};
