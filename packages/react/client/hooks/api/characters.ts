'use client';

import {
    CharacterAnimePaginationResponse,
    CharacterMangaPaginationResponse,
    CharacterNovelPaginationResponse,
    CharacterResponse,
    CharacterVoicesPaginationResponse,
    CharactersSearchPaginationResponse,
} from '@hikka/client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { QueryParams, useQuery } from '@/client/useQuery';
import {
    characterAnimeOptions,
    characterBySlugOptions,
    characterMangaOptions,
    characterNovelOptions,
    characterVoicesOptions,
    searchCharactersOptions,
} from '@/options/api/characters';
import {
    UseCharacterContentParams,
    UseCharacterInfoParams,
    UseCharactersSearchParams,
} from '@/types/characters';

/**
 * Hook for getting character details by slug
 */
export function useCharacterBySlug<TResult = CharacterResponse>({
    slug,
    ...rest
}: UseCharacterInfoParams & QueryParams<CharacterResponse, TResult>) {
    const { client } = useHikkaClient();
    return useQuery<CharacterResponse, Error, TResult>({
        ...characterBySlugOptions(client, { slug }),
        ...rest,
    });
}

/**
 * Hook for getting character's anime appearances
 */
export function useCharacterAnime({
    slug,
    paginationArgs,
    ...rest
}: UseCharacterContentParams &
    InfiniteQueryParams<CharacterAnimePaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        characterAnimeOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

/**
 * Hook for getting character's manga appearances
 */
export function useCharacterManga({
    slug,
    paginationArgs,
    ...rest
}: UseCharacterContentParams &
    InfiniteQueryParams<CharacterMangaPaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        characterMangaOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

/**
 * Hook for getting character's novel appearances
 */
export function useCharacterNovel({
    slug,
    paginationArgs,
    ...rest
}: UseCharacterContentParams &
    InfiniteQueryParams<CharacterNovelPaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        characterNovelOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

/**
 * Hook for getting character's voice actors
 */
export function useCharacterVoices({
    slug,
    paginationArgs,
    ...rest
}: UseCharacterContentParams &
    InfiniteQueryParams<CharacterVoicesPaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        characterVoicesOptions(client, { slug, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

/**
 * Hook for searching characters
 */
export function useSearchCharacters({
    args = {},
    paginationArgs,
    ...rest
}: UseCharactersSearchParams &
    InfiniteQueryParams<CharactersSearchPaginationResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        searchCharactersOptions(client, { args, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}
