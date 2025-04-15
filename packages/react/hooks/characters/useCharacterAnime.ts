import { CharacterAnimePaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCharacterAnimeOptions
    extends Omit<
        UseQueryOptions<
            CharacterAnimePaginationResponse,
            Error,
            CharacterAnimePaginationResponse,
            ReturnType<typeof queryKeys.characters.anime>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting character's anime appearances
 */
export function useCharacterAnime(
    slug: string,
    options: UseCharacterAnimeOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.characters.anime(slug),
        (client) => client.characters.getAnime(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchCharacterAnime(
    queryClient: QueryClient,
    slug: string,
    options: UseCharacterAnimeOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.characters.anime(slug),
        (client) => client.characters.getAnime(slug, page, size),
        queryOptions,
    );
}
