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
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting character's voice actors
 */
export function useCharacterVoices(params: UseCharacterVoicesOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.characters.voices(slug),
        (client) => client.characters.getVoices(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchCharacterVoicesParams
    extends UseCharacterVoicesOptions {
    queryClient: QueryClient;
}

export async function prefetchCharacterVoices(
    params: PrefetchCharacterVoicesParams,
) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.characters.voices(slug),
        (client) => client.characters.getVoices(slug, page, size),
        queryOptions,
    );
}
