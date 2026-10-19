import {
    type Client,
    type CollectionContentTypeEnum,
    getCollectionsInfiniteOptions,
    getUserCollectionsInfiniteOptions,
    paginatedInfiniteOptions,
    paginationPageParam,
} from '@hikka/api';
import type { CollectionNewSearch, CollectionsSearch } from '@hikka/core';

import { contentInfoOptions } from '@/utils/api/content-queries';
import type { LoaderContext } from '@/utils/api/loader-prefetch';

export const DEFAULT_COLLECTION_SORT = 'system_ranking';

export function collectionListOptions(
    { page, sort = DEFAULT_COLLECTION_SORT }: CollectionsSearch,
    client?: Client,
) {
    return paginatedInfiniteOptions(
        getCollectionsInfiniteOptions({
            body: { sort: [`${sort}:desc`] },
            client,
        }),
        Number(page),
    );
}

export const USER_COLLECTIONS_PAGE_SIZE = 50;

export function userCollectionsOptions(
    content_type: CollectionContentTypeEnum,
    slug: string,
    search?: string,
    client?: Client,
) {
    return {
        ...getUserCollectionsInfiniteOptions({
            query: {
                content_type,
                content: slug,
                query: search,
                size: USER_COLLECTIONS_PAGE_SIZE,
            },
            client,
        }),
        ...paginationPageParam(),
    };
}

export async function loadCollectionNew(
    { content_type, slug }: CollectionNewSearch,
    { queryClient, apiClient }: LoaderContext,
): Promise<void> {
    if (!content_type || !slug) return;
    await queryClient.prefetchQuery(
        contentInfoOptions(content_type, slug, apiClient),
    );
}
