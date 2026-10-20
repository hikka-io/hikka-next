import type {
    ArticleCategoryEnum,
    ArticlesListArgs,
    CollectionsListArgs,
} from '@hikka/api';

import { ARTICLE_CATEGORY } from './labels';
import type { ArticlesSearch, CollectionsSearch } from './search-schemas';
import { expandSort } from './sort';

export type CollectionSort = NonNullable<CollectionsSearch['sort']>;

export const DEFAULT_COLLECTION_SORT: CollectionSort = 'system_ranking';

export const COLLECTION_SORT_OPTIONS: readonly {
    value: CollectionSort;
    label: string;
}[] = [
    { value: 'system_ranking', label: 'Популярні' },
    { value: 'created', label: 'Нові' },
];

/** The collections page body; the sort is a single descending field. */
export function collectionListArgs(
    sort: CollectionSort = DEFAULT_COLLECTION_SORT,
): CollectionsListArgs {
    return { sort: [`${sort}:desc`] };
}

/** The articles page body built from its search params. */
export function articleListArgs(search: ArticlesSearch): ArticlesListArgs {
    return {
        categories: (search.categories ?? []) as ArticleCategoryEnum[],
        author: search.author || undefined,
        sort: expandSort('article', search.sort, search.order),
        tags: search.tags?.length ? search.tags : undefined,
        draft: Boolean(search.draft),
    };
}

/** Categories anyone can filter by; the system category is for staff. */
export const PUBLIC_ARTICLE_CATEGORIES = (
    Object.keys(ARTICLE_CATEGORY) as ArticleCategoryEnum[]
).filter((category) => !ARTICLE_CATEGORY[category].admin);
