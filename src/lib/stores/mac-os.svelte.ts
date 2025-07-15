import { REQUIRED_MAC_OS_VERSION } from '$lib/helpers/constants';
import { platform, version } from '@tauri-apps/plugin-os';

export const systemRequirements = {
    name: platform(),
    version: version()
};

export const isSupportedVersion = () =>
    parseFloat(systemRequirements.version) >= REQUIRED_MAC_OS_VERSION;
export const isUnsupported = () => !isSupportedVersion();
