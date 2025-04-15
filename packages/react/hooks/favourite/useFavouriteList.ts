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
    page?: number;
    size?: number;
}

/**
 * Hook for getting a user's favourite list
 */
export function useFavouriteList(
    contentType: FavouriteContentTypeEnum,
    username: string,
    options: UseFavouriteListOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.favourite.list(contentType, username),
        (client) => client.favourite.getList(contentType, username, page, size),
        {
            enabled: !!contentType && !!username,
            ...queryOptions,
        },
    );
}

export async function prefetchFavouriteList(
    queryClient: QueryClient,
    contentType: FavouriteContentTypeEnum,
    username: string,
    options: UseFavouriteListOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.favourite.list(contentType, username),
        (client) => client.favourite.getList(contentType, username, page, size),
        queryOptions,
    );
}
