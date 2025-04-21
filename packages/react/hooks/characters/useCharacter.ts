import { CharacterResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for getting character details by slug
 */
export function useCharacter(
    slug: string,
    options?: Omit<
        UseQueryOptions<CharacterResponse, Error, CharacterResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.characters.bySlug(slug),
        queryFn: (client) => client.characters.getBySlug(slug),
        options: options || {},
    });
}

/**
 * Function for prefetching character details
 */
export async function prefetchCharacter(
    queryClient: QueryClient,
    slug: string,
    options?: Omit<
        FetchQueryOptions<CharacterResponse, Error, CharacterResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.characters.bySlug(slug),
        queryFn: (client) => client.characters.getBySlug(slug),
        options: options || {},
    });
}
