import { CollectionArgs, CollectionResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type UpdateCollectionVariables = {
    reference: string;
    args: CollectionArgs;
};

export interface UseUpdateCollectionOptions
    extends Omit<
        UseMutationOptions<
            CollectionResponse,
            Error,
            UpdateCollectionVariables
        >,
        'mutationFn'
    > {}

/**
 * Hook for updating a collection
 */
export function useUpdateCollection(
    params: UseUpdateCollectionOptions = {},
): UseMutationResult<CollectionResponse, Error, UpdateCollectionVariables> {
    return createMutation<CollectionResponse, Error, UpdateCollectionVariables>(
        (client, { reference, args }) =>
            client.collections.update(reference, args),
        (variables) => [
            // Invalidate the specific collection
            queryKeys.collections.details(variables.reference),
            // Invalidate collections list
            queryKeys.collections.all,
        ],
    )(params);
}
