import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseAnimeCharactersParams,
    UseAnimeEpisodesParams,
    UseAnimeFranchiseParams,
    UseAnimeInfoParams,
    UseAnimeRecommendationsParams,
    UseAnimeSearchParams,
    UseAnimeStaffParams,
} from '@/types/anime';

export function animeBySlugOptions(
    client: HikkaClient,
    { slug }: UseAnimeInfoParams,
) {
    return queryOptions({
        queryKey: queryKeys.anime.details(slug),
        queryFn: () => client.anime.getAnimeBySlug(slug),
    });
}

export function animeCharactersOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseAnimeCharactersParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.anime.characters(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.anime.getAnimeCharacters(slug, {
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

export function animeStaffOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseAnimeStaffParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.anime.staff(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.anime.getAnimeStaff(slug, {
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

export function animeEpisodesOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseAnimeEpisodesParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.anime.episodes(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.anime.getAnimeEpisodes(slug, {
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

export function animeFranchiseOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseAnimeFranchiseParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.anime.franchise(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.anime.getAnimeFranchise(slug, {
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

export function animeRecommendationsOptions(
    client: HikkaClient,
    {
        slug,
        paginationArgs,
    }: UseAnimeRecommendationsParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.anime.recommendations(slug, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.anime.getAnimeRecommendations(slug, {
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

export function searchAnimesOptions(
    client: HikkaClient,
    {
        args,
        paginationArgs,
    }: UseAnimeSearchParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.anime.search({ args, paginationArgs }),
        queryFn: ({ pageParam }) =>
            client.anime.searchAnimes(args, {
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
