import {
    type ArticleCategoryEnum,
    type Client,
    getArticlesInfiniteOptions,
} from '@hikka/api';

import type { ArticlesSearch } from '@/utils/search-schemas';
import { expandSort } from '@/utils/sort';

export function articleListOptions(search: ArticlesSearch, client?: Client) {
    return getArticlesInfiniteOptions({
        body: {
            categories: (search.categories ?? []) as ArticleCategoryEnum[],
            author: search.author || undefined,
            sort: expandSort('article', search.sort, search.order),
            tags: search.tags?.length ? search.tags : undefined,
            draft: Boolean(search.draft),
        },
        client,
    });
}
