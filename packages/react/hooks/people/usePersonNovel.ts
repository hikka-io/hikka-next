import { PersonNovelPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UsePersonNovelOptions
    extends Omit<
        UseQueryOptions<
            PersonNovelPaginationResponse,
            Error,
            PersonNovelPaginationResponse,
            ReturnType<typeof queryKeys.people.novel>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting a person's novel work
 */
export function usePersonNovel(params: UsePersonNovelOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.people.novel(slug),
        (client) => client.people.getNovel(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchPersonNovelParams extends UsePersonNovelOptions {
    queryClient: QueryClient;
}

export async function prefetchPersonNovel(params: PrefetchPersonNovelParams) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.people.novel(slug),
        (client) => client.people.getNovel(slug, page, size),
        queryOptions,
    );
}
