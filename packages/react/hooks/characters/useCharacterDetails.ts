import { CharacterCountResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCharacterDetailsOptions
    extends Omit<
        UseQueryOptions<
            CharacterCountResponse,
            Error,
            CharacterCountResponse,
            ReturnType<typeof queryKeys.characters.details>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
}

/**
 * Hook for getting character details by slug
 */
export function useCharacterDetails(params: UseCharacterDetailsOptions) {
    const { slug, ...options } = params;

    return useQuery(
        queryKeys.characters.details(slug),
        (client) => client.characters.getBySlug(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export interface PrefetchCharacterDetailsParams
    extends UseCharacterDetailsOptions {
    queryClient: QueryClient;
}

export async function prefetchCharacterDetails(
    params: PrefetchCharacterDetailsParams,
) {
    const { queryClient, slug, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.characters.details(slug),
        (client) => client.characters.getBySlug(slug),
        options,
    );
}
