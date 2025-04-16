import {
    FavouriteContentTypeEnum,
    FavouritePaginationResponse,
} from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseFavouriteListOptions
    extends Omit<
        UseQueryOptions<
            FavouritePaginationResponse,
            Error,
            FavouritePaginationResponse,
            ReturnType<typeof queryKeys.favourite.list>
        >,
        'queryKey' | 'queryFn'
    > {
    contentType: FavouriteContentTypeEnum;
    username: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting a user's favourite list
 */
export function useFavouriteList(params: UseFavouriteListOptions) {
    const {
        contentType,
        username,
        page = 1,
        size = 15,
        ...queryOptions
    } = params;

    return useQuery(
        queryKeys.favourite.list(contentType, username),
        (client) => client.favourite.getList(contentType, username, page, size),
        {
            enabled: !!contentType && !!username,
            ...queryOptions,
        },
    );
}

export interface PrefetchFavouriteListParams extends UseFavouriteListOptions {
    queryClient: QueryClient;
}

export async function prefetchFavouriteList(
    params: PrefetchFavouriteListParams,
) {
    const {
        queryClient,
        contentType,
        username,
        page = 1,
        size = 15,
        ...queryOptions
    } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.favourite.list(contentType, username),
        (client) => client.favourite.getList(contentType, username, page, size),
        queryOptions,
    );
}
