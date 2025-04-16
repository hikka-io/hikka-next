import { CharacterAnimePaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
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
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting character's anime appearances
 */
export function useCharacterAnime(params: UseCharacterAnimeOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.characters.anime(slug),
        (client) => client.characters.getAnime(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchCharacterAnimeParams extends UseCharacterAnimeOptions {
    queryClient: QueryClient;
}

export async function prefetchCharacterAnime(
    params: PrefetchCharacterAnimeParams,
) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.characters.anime(slug),
        (client) => client.characters.getAnime(slug, page, size),
        queryOptions,
    );
}
