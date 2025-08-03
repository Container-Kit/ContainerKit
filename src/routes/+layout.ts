import { isUnsupported } from '$lib/stores/mac-os.svelte';
import { redirect } from '@sveltejs/kit';
import { isLoading } from './loading.svelte';

export const prerender = true;
export const ssr = false;

export const load = async ({ url }) => {
    if (isUnsupported() && url.pathname !== '/unsupported') {
        return redirect(301, '/unsupported');
    }
    isLoading.setTrue();
};
