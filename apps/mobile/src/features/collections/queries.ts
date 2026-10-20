import {
    getCollectionOptions,
    getCollectionsInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';
import { type CollectionSort, collectionListArgs } from '@hikka/core';

export const COLLECTIONS_PAGE_SIZE = 15;
export const COLLECTION_PREVIEW_SIZE = 3;

export function collectionListOptions(sort: CollectionSort) {
    return paginatedInfiniteOptions(
        getCollectionsInfiniteOptions({
            body: collectionListArgs(sort),
            query: { size: COLLECTIONS_PAGE_SIZE },
        }),
    );
}

export const collectionOptions = (reference: string) =>
    getCollectionOptions({ path: { reference } });
