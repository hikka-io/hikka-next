import {
    personAnimeOptions,
    personBySlugOptions,
    personCharactersOptions,
    personMangaOptions,
    personNovelOptions,
    searchPeopleOptions,
} from '@/options/api/people';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UsePeopleSearchParams,
    UsePersonAnimeParams,
    UsePersonCharactersParams,
    UsePersonInfoParams,
    UsePersonMangaParams,
    UsePersonNovelParams,
} from '@/types/people';

/**
 * Prefetches person details for server-side rendering
 */
export async function prefetchPersonBySlug({
    slug,
    ...rest
}: PrefetchQueryParams & UsePersonInfoParams) {
    return prefetchQuery({
        optionsFactory: (client) => personBySlugOptions(client, { slug }),
        ...rest,
    });
}

/**
 * Prefetches person's anime work for server-side rendering
 */
export async function prefetchPersonAnime({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UsePersonAnimeParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            personAnimeOptions(client, { slug, paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches person's manga work for server-side rendering
 */
export async function prefetchPersonManga({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UsePersonMangaParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            personMangaOptions(client, { slug, paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches person's novel work for server-side rendering
 */
export async function prefetchPersonNovel({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UsePersonNovelParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            personNovelOptions(client, { slug, paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches characters voiced by this person for server-side rendering
 */
export async function prefetchPersonCharacters({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UsePersonCharactersParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            personCharactersOptions(client, { slug, paginationArgs }),
        ...rest,
    });
}

/**
 * Function for prefetching people search results
 */
export async function prefetchSearchPeople({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UsePeopleSearchParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchPeopleOptions(client, { args, paginationArgs }),
        ...rest,
    });
}
