import { CharacterMangaPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCharacterMangaOptions
    extends Omit<
        UseQueryOptions<
            CharacterMangaPaginationResponse,
            Error,
            CharacterMangaPaginationResponse,
            ReturnType<typeof queryKeys.characters.manga>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting character's manga appearances
 */
export function useCharacterManga(params: UseCharacterMangaOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.characters.manga(slug),
        (client) => client.characters.getManga(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchCharacterMangaParams extends UseCharacterMangaOptions {
    queryClient: QueryClient;
}

export async function prefetchCharacterManga(
    params: PrefetchCharacterMangaParams,
) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.characters.manga(slug),
        (client) => client.characters.getManga(slug, page, size),
        queryOptions,
    );
}
