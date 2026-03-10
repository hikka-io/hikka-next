import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseCharacterContentParams,
    UseCharacterInfoParams,
    UseCharactersSearchParams,
} from '@/types/characters';

export function characterBySlugOptions(
    client: HikkaClient,
    { slug }: UseCharacterInfoParams,
) {
    return queryOptions({
        queryKey: queryKeys.characters.bySlug(slug),
        queryFn: () => client.characters.getCharacterBySlug(slug),
    });
}

export function characterAnimeOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseCharacterContentParams,
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.characters.anime(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.characters.getCharacterAnime(slug, {
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

export function characterMangaOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseCharacterContentParams,
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.characters.manga(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.characters.getCharacterManga(slug, {
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

export function characterNovelOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseCharacterContentParams,
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.characters.novel(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.characters.getCharacterNovel(slug, {
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

export function characterVoicesOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseCharacterContentParams,
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.characters.voices(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.characters.getCharacterVoices(slug, {
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

export function searchCharactersOptions(
    client: HikkaClient,
    {
        args = {},
        paginationArgs,
    }: UseCharactersSearchParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.characters.search(args, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.characters.searchCharacters(args, {
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
