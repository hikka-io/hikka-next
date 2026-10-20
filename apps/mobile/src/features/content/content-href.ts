import type { Href } from 'expo-router';

import type { ContentTypeEnum } from '@hikka/api';
import { contentPath } from '@hikka/core';

export const SITE_ORIGIN = 'https://hikka.io';

export const contentHref = (type: ContentTypeEnum, slug: string) =>
    contentPath(type, slug) as Href;

export const contentWebUrl = (type: ContentTypeEnum, slug: string) =>
    `${SITE_ORIGIN}${contentPath(type, slug)}`;
