import {redirect} from "@sveltejs/kit";

export const load = async ({url}) => {
    if (url.pathname === '/') {
        return redirect(301, '/containers')
    }
}