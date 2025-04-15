import {
    ReadContentTypeEnum,
    ReadPaginationResponse,
    ReadSearchArgs,
} from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseReadListOptions
    extends Omit<
        UseQueryOptions<
            ReadPaginationResponse,
            Error,
            ReadPaginationResponse,
            ReturnType<typeof queryKeys.read.list>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for getting a user's read list
 */
export function useReadList(
    contentType: ReadContentTypeEnum,
    username: string,
    args: ReadSearchArgs,
    options: UseReadListOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.read.list(contentType, username, { ...args, page, size }),
        (client) =>
            client.read.getList(contentType, username, args, page, size),
        {
            enabled: !!contentType && !!username,
            ...queryOptions,
        },
    );
}

export async function prefetchReadList(
    queryClient: QueryClient,
    contentType: ReadContentTypeEnum,
    username: string,
    args: ReadSearchArgs,
    options: UseReadListOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.read.list(contentType, username, { ...args, page, size }),
        (client) =>
            client.read.getList(contentType, username, args, page, size),
        queryOptions,
    );
}
