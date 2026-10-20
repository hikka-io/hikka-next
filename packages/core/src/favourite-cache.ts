import type { QueryClient } from '@tanstack/query-core';

import {
    type FavouriteContentTypeEnum,
    type FavouriteResponse,
    getFavouriteQueryKey,
} from '@hikka/api';

import {
    type InvalidateOptions,
    invalidateByIds,
    setQueryDataAfterCancel,
} from './content-cache';
import { FAVOURITE_LIST_IDS } from './query-groups';

/** Write an added favourite into the per-content cache, then invalidate the lists. */
export function applyFavouriteMutation(
    queryClient: QueryClient,
    content_type: FavouriteContentTypeEnum,
    slug: string,
    data: FavouriteResponse,
    options?: InvalidateOptions,
): Promise<void> {
    queryClient.setQueryData(
        getFavouriteQueryKey({ path: { content_type, slug } }),
        data,
    );
    return invalidateByIds(queryClient, FAVOURITE_LIST_IDS, options);
}

/** Favourite mirror of `applyWatchDeletion`. */
export async function applyFavouriteDeletion(
    queryClient: QueryClient,
    content_type: FavouriteContentTypeEnum,
    slug: string,
    options?: InvalidateOptions,
): Promise<void> {
    await setQueryDataAfterCancel(
        queryClient,
        getFavouriteQueryKey({ path: { content_type, slug } }),
        null,
    );
    return invalidateByIds(queryClient, FAVOURITE_LIST_IDS, options);
}
