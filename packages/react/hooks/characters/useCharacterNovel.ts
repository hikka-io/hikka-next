import { CharacterNovelPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCharacterNovelOptions
    extends Omit<
        UseQueryOptions<
            CharacterNovelPaginationResponse,
            Error,
            CharacterNovelPaginationResponse,
            ReturnType<typeof queryKeys.characters.novel>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting character's novel appearances
 */
export function useCharacterNovel(params: UseCharacterNovelOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.characters.novel(slug),
        (client) => client.characters.getNovel(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchCharacterNovelParams extends UseCharacterNovelOptions {
    queryClient: QueryClient;
}

export async function prefetchCharacterNovel(
    params: PrefetchCharacterNovelParams,
) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.characters.novel(slug),
        (client) => client.characters.getNovel(slug, page, size),
        queryOptions,
    );
}
