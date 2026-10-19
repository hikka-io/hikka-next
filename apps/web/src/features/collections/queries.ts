import {
    type Client,
    type CollectionContentTypeEnum,
    getCollectionsInfiniteOptions,
    paginatedInfiniteOptions,
    paginationPageParam,
} from '@hikka/api';

import { contentInfoOptions } from '@/utils/api/content-queries';
import type { LoaderContext } from '@/utils/api/loader-prefetch';
import type {
    CollectionNewSearch,
    CollectionsSearch,
} from '@/utils/search-schemas';

export const DEFAULT_COLLECTION_SORT = 'system_ranking';

export const OWN_COLLECTIONS_PAGE_SIZE = 50;

// Backend page-size cap (`get_size`, le=100).
const OWN_CONTENT_COLLECTIONS_PAGE_SIZE = 100;

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

export function ownCollectionsOptions(
    username: string,
    content_type: CollectionContentTypeEnum,
    client?: Client,
) {
    return {
        ...getCollectionsInfiniteOptions({
            body: {
                author: username,
                content_type,
                only_public: false,
                sort: ['created:desc'],
            },
            query: { size: OWN_COLLECTIONS_PAGE_SIZE },
            client,
        }),
        ...paginationPageParam(),
    };
}

export function ownContentCollectionsOptions(
    username: string,
    content_type: CollectionContentTypeEnum,
    slug: string,
    client?: Client,
) {
    return {
        ...getCollectionsInfiniteOptions({
            body: {
                author: username,
                content_type,
                content: [slug],
                only_public: false,
            },
            query: { size: OWN_CONTENT_COLLECTIONS_PAGE_SIZE },
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
