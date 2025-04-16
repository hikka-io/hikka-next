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
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting novel characters by novel slug
 */
export function useNovelCharacters(params: UseNovelCharactersOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.novel.characters(slug),
        (client) => client.novel.getCharacters(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchNovelCharactersParams
    extends UseNovelCharactersOptions {
    queryClient: QueryClient;
}

export async function prefetchNovelCharacters(
    params: PrefetchNovelCharactersParams,
) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.novel.characters(slug),
        (client) => client.novel.getCharacters(slug, page, size),
        queryOptions,
    );
}
