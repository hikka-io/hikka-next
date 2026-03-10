import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import {
    UseCollectionParams,
    UseCollectionsListParams,
} from '@/types/collections';

export function collectionByReferenceOptions(
    client: HikkaClient,
    { reference }: UseCollectionParams,
) {
    return queryOptions({
        queryKey: queryKeys.collections.byReference(reference),
        queryFn: () => client.collections.getCollectionByReference(reference),
    });
}

export function searchCollectionsOptions(
    client: HikkaClient,
    {
        args,
        paginationArgs,
    }: UseCollectionsListParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.collections.list(args, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.collections.searchCollections(args, {
                page: pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page ?? 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}
