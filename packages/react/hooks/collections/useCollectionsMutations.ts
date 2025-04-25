import { CollectionArgs } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

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
    invalidateQueries: ({ reference }) => [
        queryKeys.collections.byReference(reference),
        queryKeys.collections.all,
    ],
});

/**
 * Hook for deleting a collection
 */
export const useDeleteCollection = createMutation({
    mutationFn: (client, reference: string) =>
        client.collections.deleteCollection(reference),
    invalidateQueries: () => [queryKeys.collections.all],
});
