'use client';

import type {
    FavouriteContentType,
    FavouriteItem,
    FavouritePaginationResponse,
    FavouriteResponse,
} from '@hikka/client';

import type {
    UseFavouriteListParams,
    UseFavouriteStatusParams,
} from '@/types/favourite';
import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    type InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { type QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    favouriteStatusOptions,
    userFavouritesOptions,
} from '@/options/api/favourite';

/**
 * Hook for checking favourite status
 */
export function useFavouriteStatus({
    contentType,
    slug,
    options,
    ...rest
}: UseFavouriteStatusParams & QueryParams<FavouriteResponse>) {
    const { client } = useHikkaClient();
    return useQuery({
        ...favouriteStatusOptions(client, { contentType, slug }),
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });
}

/**
 * Hook for retrieving a user's favourite list
 */
export function useUserFavourites<TItem extends FavouriteItem>({
    contentType,
    username,
    paginationArgs,
    ...rest
}: UseFavouriteListParams &
    InfiniteQueryParams<FavouritePaginationResponse<TItem>>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        userFavouritesOptions<TItem>(client, {
            contentType,
            username,
            paginationArgs,
        });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}

type FavouriteVariables = {
    contentType: FavouriteContentType;
    slug: string;
};

/**
 * Hook for adding to favourites
 */
export const useCreateFavourite = createMutation({
    mutationFn: (client, { contentType, slug }: FavouriteVariables) =>
        client.favourite.createFavourite(contentType, slug),
    invalidateQueries: ({ contentType, slug }) => [
        queryKeys.favourite.status(contentType, slug),
    ],
});

/**
 * Hook for removing from favourites
 */
export const useDeleteFavourite = createMutation({
    mutationFn: (client, { contentType, slug }: FavouriteVariables) =>
        client.favourite.deleteFavourite(contentType, slug),
    invalidateQueries: ({ contentType, slug }) => [
        queryKeys.favourite.status(contentType, slug),
    ],
});
