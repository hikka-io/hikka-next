import {
    type Client,
    getArticlesInfiniteOptions,
    paginationPageParam,
} from '@hikka/api';
import { type ArticlesSearch, articleListArgs } from '@hikka/core';

export function articleListOptions(search: ArticlesSearch, client?: Client) {
    return {
        ...getArticlesInfiniteOptions({
            body: articleListArgs(search),
            client,
        }),
        ...paginationPageParam(),
    };
}
