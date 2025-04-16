import { CharacterResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCharacterOptions
    extends Omit<
        UseQueryOptions<
            CharacterResponse,
            Error,
            CharacterResponse,
            ReturnType<typeof queryKeys.characters.details>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
}

/**
 * Hook for getting a character by slug
 */
export function useCharacter(params: UseCharacterOptions) {
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

export interface PrefetchCharacterParams extends UseCharacterOptions {
    queryClient: QueryClient;
}

export function prefetchCharacter(params: PrefetchCharacterParams) {
    const { queryClient, slug, ...options } = params;

    return prefetchQuery(
        queryClient,
        queryKeys.characters.details(slug),
        (client) => client.characters.getBySlug(slug),
        options,
    );
}
