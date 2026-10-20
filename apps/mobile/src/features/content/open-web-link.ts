import { openBrowserAsync } from 'expo-web-browser';
import { toast } from 'sonner-native';

import { parseUrl } from '@hikka/core';

const WEB_PROTOCOLS = ['http:', 'https:'];

/** Opens a link from the content data in the in-app browser; anything but http(s) stays inert. */
export function openWebLink(url: string) {
    if (!WEB_PROTOCOLS.includes(parseUrl(url)?.protocol ?? '')) return;
    openBrowserAsync(url).catch(() =>
        toast.error('Не вдалося відкрити посилання'),
    );
}
