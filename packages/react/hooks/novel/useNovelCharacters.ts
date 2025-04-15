import { ContentCharacterPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseNovelCharactersOptions
    extends Omit<
        UseQueryOptions<
            ContentCharacterPaginationResponse,
            Error,
            ContentCharacterPaginationResponse,
            ReturnType<typeof queryKeys.novel.characters>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting novel characters by novel slug
 */
export function useNovelCharacters(
    slug: string,
    options: UseNovelCharactersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.novel.characters(slug),
        (client) => client.novel.getCharacters(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchNovelCharacters(
    queryClient: QueryClient,
    slug: string,
    options: UseNovelCharactersOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.novel.characters(slug),
        (client) => client.novel.getCharacters(slug, page, size),
        queryOptions,
    );
}
