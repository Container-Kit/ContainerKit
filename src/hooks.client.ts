import type {ClientInit} from "@sveltejs/kit";
import { isSupportedVersion } from "$lib/stores/mac-os.svelte";
import { startContainerization } from "$lib/services/containerization/system";

export const init: ClientInit = async () => {
    if (isSupportedVersion()) {
        await startContainerization()
    }
};