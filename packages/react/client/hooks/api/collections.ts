'use client';

import {
    CollectionArgs,
    CollectionContent,
    CollectionResponse,
    CollectionsListResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    UseCollectionParams,
    UseCollectionsListParams,
} from '@/types/collections';

/**
 * Hook for retrieving a collection by reference
 */
export function useCollectionByReference<
    TResult = CollectionResponse<CollectionContent>,
>({
    reference,
    ...rest
}: UseCollectionParams &
    QueryParams<CollectionResponse<CollectionContent>, TResult>) {
    return useQuery<CollectionResponse<CollectionContent>, Error, TResult>({
        queryKey: queryKeys.collections.byReference(reference),
        queryFn: (client) =>
            client.collections.getCollectionByReference(reference),
        ...rest,
    });
}

/**
 * Hook for retrieving collections list
 */
export function useSearchCollections({
    args,
    paginationArgs,
    ...rest
}: UseCollectionsListParams &
    InfiniteQueryParams<CollectionsListResponse<CollectionContent>>) {
    return useInfiniteQuery({
        queryKey: queryKeys.collections.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.collections.searchCollections(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Hook for creating a collection
 */
export const useCreateCollection = createMutation({
    mutationFn: (client, args: CollectionArgs) =>
        client.collections.createCollection(args),
    invalidateQueries: () => [queryKeys.collections.all],
});

type UpdateCollectionVariables = {
    reference: string;
    args: CollectionArgs;
};

/**
 * Hook for updating a collection
 */
export const useUpdateCollection = createMutation({
    mutationFn: (client, { reference, args }: UpdateCollectionVariables) =>
        client.collections.updateCollection(reference, args),
    invalidateQueries: ({ reference }) => [queryKeys.collections.all],
});

/**
 * Hook for deleting a collection
 */
export const useDeleteCollection = createMutation({
    mutationFn: (client, reference: string) =>
        client.collections.deleteCollection(reference),
    invalidateQueries: (reference: string) => [queryKeys.collections.all],
});
