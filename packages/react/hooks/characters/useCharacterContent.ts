import {
    CharacterAnimePaginationResponse,
    CharacterMangaPaginationResponse,
    CharacterNovelPaginationResponse,
    CharacterVoicesPaginationResponse,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseCharacterContentParams {
    slug: string;
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
            client.characters.getAnime(slug, {
                page,
                size: paginationArgs?.size,
            }),
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
            client.characters.getAnime(slug, {
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
            client.characters.getManga(slug, {
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
            client.characters.getManga(slug, {
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
            client.characters.getNovel(slug, {
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
            client.characters.getNovel(slug, {
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
            client.characters.getVoices(slug, {
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
            client.characters.getVoices(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
