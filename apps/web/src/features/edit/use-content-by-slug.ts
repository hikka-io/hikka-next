import { useQuery } from '@tanstack/react-query';

import type { EditContentTypeEnum } from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';

import type { EditMainContent } from './types';

/**
 * Fetch the editable content for a slug via the type-appropriate detail endpoint.
 * Detail endpoints return supersets of `EditMainContent`; the edit UI reads only the
 * shared subset, so the result is narrowed to the shared union.
 */
export function useContentBySlug(
    contentType: EditContentTypeEnum,
    slug: string,
): EditMainContent | undefined {
    const { data } = useQuery(contentInfoOptions(contentType, slug));

    return data as EditMainContent | undefined;
}
