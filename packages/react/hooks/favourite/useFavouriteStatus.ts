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
    > {}

/**
 * Hook for getting favourite status for content
 */
export function useFavouriteStatus(
    contentType: FavouriteContentTypeEnum,
    slug: string,
    options: UseFavouriteStatusOptions = {},
) {
    return useQuery(
        queryKeys.favourite.get(contentType, slug),
        (client) => client.favourite.get(contentType, slug),
        {
            enabled: !!contentType && !!slug,
            ...options,
        },
    );
}

export async function prefetchFavouriteStatus(
    queryClient: QueryClient,
    contentType: FavouriteContentTypeEnum,
    slug: string,
    options: UseFavouriteStatusOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.favourite.get(contentType, slug),
        (client) => client.favourite.get(contentType, slug),
        options,
    );
}
