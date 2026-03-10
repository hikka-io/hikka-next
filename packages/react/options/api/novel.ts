import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseNovelCharactersParams,
    UseNovelInfoParams,
    UseSearchNovelsParams,
} from '@/types/novel';

export function novelBySlugOptions(
    client: HikkaClient,
    { slug }: UseNovelInfoParams,
) {
    return queryOptions({
        queryKey: queryKeys.novel.details(slug),
        queryFn: () => client.novel.getNovelBySlug(slug),
    });
}

export function novelCharactersOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseNovelCharactersParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.novel.characters(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.novel.getNovelCharacters(slug, {
                page: pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}

export function searchNovelsOptions(
    client: HikkaClient,
    {
        args,
        paginationArgs,
    }: UseSearchNovelsParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.novel.search({ args, paginationArgs }),
        queryFn: ({ pageParam }) =>
            client.novel.searchNovels(args, {
                page: pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}
