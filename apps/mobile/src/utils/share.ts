import { Platform, Share } from 'react-native';

import { SITE_ORIGIN } from './site-origin';

export const siteUrl = (path: string) => `${SITE_ORIGIN}${path}`;

// iOS shares a `url` as a link and would repeat a `message`; Android only reads the message.
export const shareSitePath = (path: string) => {
    const url = siteUrl(path);

    return Share.share(Platform.OS === 'ios' ? { url } : { message: url });
};
