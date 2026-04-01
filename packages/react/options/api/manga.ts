import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseMangaCharactersParams,
    UseMangaInfoParams,
    UseSearchMangasParams,
} from '@/types/manga';

export function mangaBySlugOptions(
    client: HikkaClient,
    { slug }: UseMangaInfoParams,
) {
    return queryOptions({
        queryKey: queryKeys.manga.details(slug),
        queryFn: () => client.manga.getMangaBySlug(slug),
    });
}

export function mangaCharactersOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseMangaCharactersParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.manga.characters(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.manga.getMangaCharacters(slug, {
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

export function searchMangasOptions(
    client: HikkaClient,
    {
        args,
        paginationArgs,
    }: UseSearchMangasParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.manga.search({ args, paginationArgs }),
        queryFn: ({ pageParam }) =>
            client.manga.searchMangas(args, {
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
