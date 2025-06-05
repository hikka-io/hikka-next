'use client';

import {
    CharacterAnimePaginationResponse,
    CharacterMangaPaginationResponse,
    CharacterNovelPaginationResponse,
    CharacterResponse,
    CharacterVoicesPaginationResponse,
    CharactersSearchPaginationResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
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
    return useQuery<CharacterResponse, Error, TResult>({
        queryKey: queryKeys.characters.bySlug(slug),
        queryFn: (client) => client.characters.getCharacterBySlug(slug),
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
    return useInfiniteQuery({
        queryKey: queryKeys.characters.anime(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getCharacterAnime(slug, {
                page,
                size: paginationArgs?.size,
            }),
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
    return useInfiniteQuery({
        queryKey: queryKeys.characters.manga(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getCharacterManga(slug, {
                page,
                size: paginationArgs?.size,
            }),
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
    return useInfiniteQuery({
        queryKey: queryKeys.characters.novel(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getCharacterNovel(slug, {
                page,
                size: paginationArgs?.size,
            }),
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
    return useInfiniteQuery({
        queryKey: queryKeys.characters.voices(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.getCharacterVoices(slug, {
                page,
                size: paginationArgs?.size,
            }),
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
    return useInfiniteQuery({
        queryKey: queryKeys.characters.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.searchCharacters(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
