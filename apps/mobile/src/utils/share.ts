import { Share } from 'react-native';

import { SITE_ORIGIN } from './site-origin';

export const siteUrl = (path: string) => `${SITE_ORIGIN}${path}`;

export const shareSitePath = (path: string, title?: string) => {
    const url = siteUrl(path);

    return Share.share(
        title ? { message: url, url, title } : { message: url, url },
    );
};
