import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UsePeopleSearchParams,
    UsePersonAnimeParams,
    UsePersonCharactersParams,
    UsePersonInfoParams,
    UsePersonMangaParams,
    UsePersonNovelParams,
} from '@/types/people';

export function personBySlugOptions(
    client: HikkaClient,
    { slug }: UsePersonInfoParams,
) {
    return queryOptions({
        queryKey: queryKeys.people.bySlug(slug),
        queryFn: () => client.people.getPersonBySlug(slug),
    });
}

export function searchPeopleOptions(
    client: HikkaClient,
    {
        args = {},
        paginationArgs,
    }: UsePeopleSearchParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.people.search(args, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.people.searchPeople(args, {
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

export function personAnimeOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UsePersonAnimeParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.people.anime(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.people.getPersonAnime(slug, {
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

export function personMangaOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UsePersonMangaParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.people.manga(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.people.getPersonManga(slug, {
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

export function personNovelOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UsePersonNovelParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.people.novel(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.people.getPersonNovel(slug, {
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

export function personCharactersOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UsePersonCharactersParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.people.characters(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.people.getPersonCharacters(slug, {
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
