'use client';

import {
    FavouriteContentType,
    FavouriteItem,
    FavouritePaginationResponse,
    FavouriteResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    UseFavouriteListParams,
    UseFavouriteStatusParams,
} from '@/types/favourite';

/**
 * Hook for checking favourite status
 */
export function useFavouriteStatus({
    contentType,
    slug,
    options,
    ...rest
}: UseFavouriteStatusParams & QueryParams<FavouriteResponse>) {
    return useQuery({
        queryKey: queryKeys.favourite.status(contentType, slug),
        queryFn: (client) =>
            client.favourite.getFavouriteStatus(contentType, slug),
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
    return useInfiniteQuery({
        queryKey: queryKeys.favourite.list(
            contentType,
            username,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.favourite.getUserFavourites<TItem>(contentType, username, {
                page,
                size: paginationArgs?.size,
            }),
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
