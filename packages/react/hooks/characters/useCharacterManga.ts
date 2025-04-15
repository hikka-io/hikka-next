import { CharacterMangaPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

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
    page?: number;
    size?: number;
}

/**
 * Hook for getting character's manga appearances
 */
export function useCharacterManga(
    slug: string,
    options: UseCharacterMangaOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.characters.manga(slug),
        (client) => client.characters.getManga(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchCharacterManga(
    queryClient: QueryClient,
    slug: string,
    options: UseCharacterMangaOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.characters.manga(slug),
        (client) => client.characters.getManga(slug, page, size),
        queryOptions,
    );
}
