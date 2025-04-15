import { ContentCharacterPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseMangaCharactersOptions
    extends Omit<
        UseQueryOptions<
            ContentCharacterPaginationResponse,
            Error,
            ContentCharacterPaginationResponse,
            ReturnType<typeof queryKeys.manga.characters>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting manga characters by manga slug
 */
export function useMangaCharacters(
    slug: string,
    options: UseMangaCharactersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.manga.characters(slug),
        (client) => client.manga.getCharacters(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchMangaCharacters(
    queryClient: QueryClient,
    slug: string,
    options: UseMangaCharactersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.manga.characters(slug),
        (client) => client.manga.getCharacters(slug, page, size),
        queryOptions,
    );
}
