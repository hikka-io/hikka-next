import { Platform, Share } from 'react-native';

import { siteUrl } from './site-origin';

// iOS shares a `url` as a link and would repeat a `message`; Android only reads the message.
export const shareSitePath = (path: string) => {
    const url = siteUrl(path);

    return Share.share(Platform.OS === 'ios' ? { url } : { message: url });
};
