import {
    type ArticleCategoryEnum,
    getArticleOptions,
    getArticlesInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';
import { articleListArgs, type SortOrder } from '@hikka/core';

export const ARTICLES_PAGE_SIZE = 10;

export type ArticleListFilter = {
    category?: ArticleCategoryEnum;
    sort?: string;
    order?: SortOrder;
};

export function articleListOptions({
    category,
    sort,
    order,
}: ArticleListFilter) {
    return paginatedInfiniteOptions(
        getArticlesInfiniteOptions({
            body: articleListArgs({
                categories: category ? [category] : undefined,
                sort,
                order,
            }),
            query: { size: ARTICLES_PAGE_SIZE },
        }),
    );
}

export const articleOptions = (slug: string) =>
    getArticleOptions({ path: { slug } });
