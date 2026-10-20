import { Platform, Share } from 'react-native';

import { siteUrl } from './site-origin';

// iOS shares a `url` as a link and would repeat a `message`; Android only reads `message` and shows `title` in the chooser.
export const shareSitePath = (path: string, title?: string) => {
    const url = siteUrl(path);

    return Share.share(
        Platform.OS === 'ios' ? { url } : { title, message: url },
    );
};
