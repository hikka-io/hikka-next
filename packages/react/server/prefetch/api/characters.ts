import {
    CharacterAnimePaginationResponse,
    CharacterMangaPaginationResponse,
    CharacterNovelPaginationResponse,
    CharacterResponse,
    CharacterVoicesPaginationResponse,
    CharactersSearchPaginationResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseCharacterContentParams,
    UseCharacterInfoParams,
    UseCharactersSearchParams,
} from '@/types/characters';

/**
 * Function for prefetching character details
 */
export async function prefetchCharacterBySlug({
    slug,
    ...rest
}: PrefetchQueryParams<CharacterResponse> & UseCharacterInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.characters.bySlug(slug),
        queryFn: (client) => client.characters.getCharacterBySlug(slug),
        ...rest,
    });
}

/**
 * Function for prefetching character's anime appearances
 */
export async function prefetchCharacterAnime({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<CharacterAnimePaginationResponse> &
    UseCharacterContentParams) {
    return prefetchInfiniteQuery({
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
 * Function for prefetching character's manga appearances
 */
export async function prefetchCharacterManga({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<CharacterMangaPaginationResponse> &
    UseCharacterContentParams) {
    return prefetchInfiniteQuery({
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
 * Function for prefetching character's novel appearances
 */
export async function prefetchCharacterNovel({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<CharacterNovelPaginationResponse> &
    UseCharacterContentParams) {
    return prefetchInfiniteQuery({
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
 * Function for prefetching character's voice actors
 */
export async function prefetchCharacterVoices({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<CharacterVoicesPaginationResponse> &
    UseCharacterContentParams) {
    return prefetchInfiniteQuery({
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
 * Function for prefetching character search results
 */
export async function prefetchSearchCharacters({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<CharactersSearchPaginationResponse> &
    UseCharactersSearchParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.characters.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.searchCharacters(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
