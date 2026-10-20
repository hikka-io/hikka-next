import type { Href } from 'expo-router';

import type { MainContentTypeEnum } from '@hikka/api';

/** The edit sheet (`src/app/list-entry/[content_type]/[slug].tsx`), a root-stack form sheet. */
export const listEntryHref = (
    contentType: MainContentTypeEnum,
    slug: string,
): Href => ({
    pathname: '/list-entry/[content_type]/[slug]',
    params: { content_type: contentType, slug },
});

export const LOGIN_HREF: Href = '/login';
