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
    contentType: ReadContentTypeEnum;
    username: string;
    args: ReadSearchArgs;
    page?: number;
    size?: number;
}

/**
 * Hook for getting a user's read list
 */
export function useReadList(params: UseReadListOptions) {
    const {
        contentType,
        username,
        args,
        page = 1,
        size = 15,
        ...queryOptions
    } = params;

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

export interface PrefetchReadListParams extends UseReadListOptions {
    queryClient: QueryClient;
}

export async function prefetchReadList(params: PrefetchReadListParams) {
    const {
        queryClient,
        contentType,
        username,
        args,
        page = 1,
        size = 15,
        ...queryOptions
    } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.read.list(contentType, username, { ...args, page, size }),
        (client) =>
            client.read.getList(contentType, username, args, page, size),
        queryOptions,
    );
}
