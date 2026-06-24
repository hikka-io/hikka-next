import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type { FavouriteItem, HikkaClient, PaginationArgs } from '@hikka/client';

import type {
    UseFavouriteListParams,
    UseFavouriteStatusParams,
} from '@/types/favourite';
import { queryKeys } from '@/core';

export function favouriteStatusOptions(
    client: HikkaClient,
    { contentType, slug }: UseFavouriteStatusParams,
) {
    return queryOptions({
        queryKey: queryKeys.favourite.status(contentType, slug),
        queryFn: () => client.favourite.getFavouriteStatus(contentType, slug),
    });
}

export function userFavouritesOptions<TItem extends FavouriteItem>(
    client: HikkaClient,
    {
        contentType,
        username,
        paginationArgs,
    }: UseFavouriteListParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.favourite.list(
            contentType,
            username,
            paginationArgs,
        ),
        queryFn: ({ pageParam }) =>
            client.favourite.getUserFavourites<TItem>(contentType, username, {
                page: pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}
