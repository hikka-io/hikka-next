import type {
    ArticleCategoryEnum,
    ArticlesListArgs,
    CollectionsListArgs,
} from '@hikka/api';

import { ARTICLE_CATEGORY } from './labels';
import {
    type ArticlesSearch,
    articlesSearchSchema,
    type CollectionsSearch,
} from './search-schemas';
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

type RouteParams = Record<string, string | string[] | undefined>;

// TanStack Router writes non-string search values as JSON (`tags=["a","b"]`); a repeated key arrives as an array.
const decodeSearchValue = (value: string | string[] | undefined) => {
    if (Array.isArray(value) || value === undefined) return value;
    if (!value.startsWith('[') && !value.startsWith('"')) return value;

    try {
        return JSON.parse(value) as unknown;
    } catch {
        return value;
    }
};

/** The articles page search from a hikka.io URL's query, decoded the way the web router writes it. */
export function articlesSearchFromParams(params: RouteParams): ArticlesSearch {
    return articlesSearchSchema.parse(
        Object.fromEntries(
            Object.entries(params).map(([key, value]) => [
                key,
                decodeSearchValue(value),
            ]),
        ),
    );
}

/** Categories anyone can filter by; the system category is for staff. */
export const PUBLIC_ARTICLE_CATEGORIES = (
    Object.keys(ARTICLE_CATEGORY) as ArticleCategoryEnum[]
).filter((category) => !ARTICLE_CATEGORY[category].admin);
