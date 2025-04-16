import { CollectionArgs, CollectionResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseCreateCollectionOptions
    extends Omit<
        UseMutationOptions<CollectionResponse, Error, CollectionArgs>,
        'mutationFn'
    > {}

/**
 * Hook for creating a collection
 */
export function useCreateCollection(
    params: UseCreateCollectionOptions = {},
): UseMutationResult<CollectionResponse, Error, CollectionArgs> {
    return createMutation<CollectionResponse, Error, CollectionArgs>(
        (client, args) => client.collections.create(args),
        () => [
            // Invalidate all collections queries
            queryKeys.collections.all,
        ],
    )(params);
}
