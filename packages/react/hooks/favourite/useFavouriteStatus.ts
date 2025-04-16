import { FavouriteContentTypeEnum, FavouriteResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseFavouriteStatusOptions
    extends Omit<
        UseQueryOptions<
            FavouriteResponse,
            Error,
            FavouriteResponse,
            ReturnType<typeof queryKeys.favourite.get>
        >,
        'queryKey' | 'queryFn'
    > {
    contentType: FavouriteContentTypeEnum;
    slug: string;
}

/**
 * Hook for getting favourite status for content
 */
export function useFavouriteStatus(params: UseFavouriteStatusOptions) {
    const { contentType, slug, ...options } = params;

    return useQuery(
        queryKeys.favourite.get(contentType, slug),
        (client) => client.favourite.get(contentType, slug),
        {
            enabled: !!contentType && !!slug,
            ...options,
        },
    );
}

export interface PrefetchFavouriteStatusParams
    extends UseFavouriteStatusOptions {
    queryClient: QueryClient;
}

export async function prefetchFavouriteStatus(
    params: PrefetchFavouriteStatusParams,
) {
    const { queryClient, contentType, slug, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.favourite.get(contentType, slug),
        (client) => client.favourite.get(contentType, slug),
        options,
    );
}
