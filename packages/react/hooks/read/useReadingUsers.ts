import { ReadContentTypeEnum, UserReadPaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseReadingUsersOptions
    extends Omit<
        UseQueryOptions<
            UserReadPaginationResponse,
            Error,
            UserReadPaginationResponse,
            ReturnType<typeof queryKeys.read.following>
        >,
        'queryKey' | 'queryFn'
    > {
    contentType: ReadContentTypeEnum;
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting users who are reading a manga or novel
 */
export function useReadingUsers(params: UseReadingUsersOptions) {
    const { contentType, slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.read.following(contentType, slug),
        (client) =>
            client.read.getFollowingUsers(contentType, slug, page, size),
        {
            enabled: !!contentType && !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchReadingUsersParams extends UseReadingUsersOptions {
    queryClient: QueryClient;
}

export async function prefetchReadingUsers(params: PrefetchReadingUsersParams) {
    const {
        queryClient,
        contentType,
        slug,
        page = 1,
        size = 15,
        ...queryOptions
    } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.read.following(contentType, slug),
        (client) =>
            client.read.getFollowingUsers(contentType, slug, page, size),
        queryOptions,
    );
}
