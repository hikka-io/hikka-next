import {
    characterAnimeOptions,
    characterBySlugOptions,
    characterMangaOptions,
    characterNovelOptions,
    characterVoicesOptions,
    searchCharactersOptions,
} from '@/options/api/characters';
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
}: PrefetchQueryParams & UseCharacterInfoParams) {
    return prefetchQuery({
        optionsFactory: (client) => characterBySlugOptions(client, { slug }),
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
}: PrefetchInfiniteQueryParams & UseCharacterContentParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            characterAnimeOptions(client, { slug, paginationArgs }),
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
}: PrefetchInfiniteQueryParams & UseCharacterContentParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            characterMangaOptions(client, { slug, paginationArgs }),
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
}: PrefetchInfiniteQueryParams & UseCharacterContentParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            characterNovelOptions(client, { slug, paginationArgs }),
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
}: PrefetchInfiniteQueryParams & UseCharacterContentParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            characterVoicesOptions(client, { slug, paginationArgs }),
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
}: PrefetchInfiniteQueryParams & UseCharactersSearchParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchCharactersOptions(client, { args, paginationArgs }),
        ...rest,
    });
}
