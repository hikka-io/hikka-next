import type { Href } from 'expo-router';

import type { ContentTypeEnum } from '@hikka/api';
import { contentPath } from '@hikka/core';

export const contentHref = (type: ContentTypeEnum, slug: string) =>
    contentPath(type, slug) as Href;
