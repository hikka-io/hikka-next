import { ContentCharacterPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseAnimeCharactersOptions
    extends Omit<
        UseQueryOptions<
            ContentCharacterPaginationResponse,
            Error,
            ContentCharacterPaginationResponse,
            ReturnType<typeof queryKeys.anime.characters>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime characters by anime slug
 */
export function useAnimeCharacters(
    slug: string,
    options: UseAnimeCharactersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.anime.characters(slug),
        (client) => client.anime.getCharacters(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchAnimeCharacters(
    queryClient: QueryClient,
    slug: string,
    options: UseAnimeCharactersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.characters(slug),
        (client) => client.anime.getCharacters(slug, page, size),
        queryOptions,
    );
}
