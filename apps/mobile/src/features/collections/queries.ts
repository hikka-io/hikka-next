import {
    getCollectionOptions,
    getCollectionsInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';
import {
    type CollectionSort,
    collectionListArgs,
    userCollectionsListArgs,
} from '@hikka/core';

const COLLECTIONS_PAGE_SIZE = 15;
export const COLLECTION_PREVIEW_SIZE = 3;
export const AUTHOR_COLLECTIONS_PREVIEW_SIZE = 3;

export function collectionListOptions(sort: CollectionSort) {
    return paginatedInfiniteOptions(
        getCollectionsInfiniteOptions({
            body: collectionListArgs(sort),
            query: { size: COLLECTIONS_PAGE_SIZE },
        }),
    );
}

/** One user's collections (the profile block and its full list), newest first. */
export function authorCollectionsOptions(
    username: string,
    { preview = false }: { preview?: boolean } = {},
) {
    return paginatedInfiniteOptions(
        getCollectionsInfiniteOptions({
            body: userCollectionsListArgs(username),
            query: {
                size: preview
                    ? AUTHOR_COLLECTIONS_PREVIEW_SIZE
                    : COLLECTIONS_PAGE_SIZE,
            },
        }),
    );
}

export const collectionOptions = (reference: string) =>
    getCollectionOptions({ path: { reference } });
