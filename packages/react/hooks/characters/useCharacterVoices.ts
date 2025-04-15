import { CharacterVoicesPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCharacterVoicesOptions
    extends Omit<
        UseQueryOptions<
            CharacterVoicesPaginationResponse,
            Error,
            CharacterVoicesPaginationResponse,
            ReturnType<typeof queryKeys.characters.voices>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting character's voice actors
 */
export function useCharacterVoices(
    slug: string,
    options: UseCharacterVoicesOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.characters.voices(slug),
        (client) => client.characters.getVoices(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchCharacterVoices(
    queryClient: QueryClient,
    slug: string,
    options: UseCharacterVoicesOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.characters.voices(slug),
        (client) => client.characters.getVoices(slug, page, size),
        queryOptions,
    );
}
