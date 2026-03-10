import { FavouriteItem } from '@hikka/client';

import {
    favouriteStatusOptions,
    userFavouritesOptions,
} from '@/options/api/favourite';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseFavouriteListParams,
    UseFavouriteStatusParams,
} from '@/types/favourite';

/**
 * Prefetches favourite status for server-side rendering
 */
export async function prefetchFavouriteStatus({
    contentType,
    slug,
    ...rest
}: PrefetchQueryParams & UseFavouriteStatusParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            favouriteStatusOptions(client, { contentType, slug }),
        ...rest,
    });
}

/**
 * Prefetches a user's favourite list for server-side rendering
 */
export async function prefetchUserFavourites<TItem extends FavouriteItem>({
    contentType,
    username,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseFavouriteListParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            userFavouritesOptions<TItem>(client, {
                contentType,
                username,
                paginationArgs,
            }),
        ...rest,
    });
}
