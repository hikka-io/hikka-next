'use client';

import {
    AnimeEpisodesListResponse,
    AnimeInfoResponse,
    AnimePaginationResponse,
    AnimeStaffPaginationResponse,
    ContentCharacterPaginationResponse,
} from '@hikka/client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { QueryParams, useQuery } from '@/client/useQuery';
import {
    animeBySlugOptions,
    animeCharactersOptions,
    animeEpisodesOptions,
    animeFranchiseOptions,
    animeRecommendationsOptions,
    animeStaffOptions,
    searchAnimesOptions,
} from '@/options/api/anime';
import {
    UseAnimeCharactersParams,
    UseAnimeEpisodesParams,
    UseAnimeFranchiseParams,
    UseAnimeInfoParams,
    UseAnimeRecommendationsParams,
    UseAnimeSearchParams,
    UseAnimeStaffParams,
} from '@/types/anime';

export function useAnimeBySlug<TResult = AnimeInfoResponse>({
    slug,
    ...rest
}: UseAnimeInfoParams & QueryParams<AnimeInfoResponse, TResult>) {
    const { client } = useHikkaClient();
    return useQuery<AnimeInfoResponse, Error, TResult>({
        ...animeBySlugOptions(client, { slug }),
        ...rest,
    });
}

export function useAnimeCharacters({
    slug,
    paginationArgs = { page: 1, size: 20 },
    ...rest
}: UseAnimeCharactersParams &
    InfiniteQueryParams<ContentCharacterPaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        animeCharactersOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

export function useAnimeStaff({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeStaffParams & InfiniteQueryParams<AnimeStaffPaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        animeStaffOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

export function useAnimeEpisodes({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeEpisodesParams & InfiniteQueryParams<AnimeEpisodesListResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        animeEpisodesOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

export function useAnimeFranchise({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeFranchiseParams & InfiniteQueryParams<AnimePaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        animeFranchiseOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

export function useAnimeRecommendations({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeRecommendationsParams &
    InfiniteQueryParams<AnimePaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        animeRecommendationsOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

export function useSearchAnimes({
    args,
    paginationArgs,
    ...rest
}: UseAnimeSearchParams & InfiniteQueryParams<AnimePaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        searchAnimesOptions(client, { args, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}
