import {
    type Client,
    getCollectionsInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';

import type { CollectionsSearch } from '@/utils/search-schemas';

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
