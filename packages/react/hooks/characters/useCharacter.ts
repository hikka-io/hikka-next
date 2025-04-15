import { CharacterCountResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCharacterOptions
    extends Omit<
        UseQueryOptions<
            CharacterCountResponse,
            Error,
            CharacterCountResponse,
            ReturnType<typeof queryKeys.characters.details>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting character details by slug
 */
export function useCharacter(slug: string, options: UseCharacterOptions = {}) {
    return useQuery(
        queryKeys.characters.details(slug),
        (client) => client.characters.getBySlug(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export async function prefetchCharacter(
    queryClient: QueryClient,
    slug: string,
    options: UseCharacterOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.characters.details(slug),
        (client) => client.characters.getBySlug(slug),
        options,
    );
}
