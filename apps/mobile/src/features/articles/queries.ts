import {
    type ArticleCategoryEnum,
    getArticleOptions,
    getArticlesInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';
import {
    type ArticlesSearch,
    articleListArgs,
    userArticlesListArgs,
} from '@hikka/core';

export const ARTICLES_PAGE_SIZE = 10;
export const AUTHOR_ARTICLES_PREVIEW_SIZE = 3;

export function articleListOptions(search: ArticlesSearch) {
    return paginatedInfiniteOptions(
        getArticlesInfiniteOptions({
            body: articleListArgs(search),
            query: { size: ARTICLES_PAGE_SIZE },
        }),
    );
}

/** The first articles of one user, for the profile block. */
export function authorArticlesPreviewOptions(username: string) {
    return paginatedInfiniteOptions(
        getArticlesInfiniteOptions({
            body: userArticlesListArgs(username),
            query: { size: AUTHOR_ARTICLES_PREVIEW_SIZE },
        }),
    );
}

export const articleOptions = (slug: string) =>
    getArticleOptions({ path: { slug } });

/** The selected category when exactly one is set; the web titles the page with it. */
export const singleCategory = (search: ArticlesSearch) =>
    search.categories?.length === 1
        ? (search.categories[0] as ArticleCategoryEnum)
        : undefined;
