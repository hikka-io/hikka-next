import { CollectionArgs, CollectionResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type UpdateCollectionVariables = {
    reference: string;
    args: CollectionArgs;
};

/**
 * Hook for updating a collection
 */
export function useUpdateCollection(
    options?: Omit<
        UseMutationOptions<
            CollectionResponse,
            Error,
            UpdateCollectionVariables
        >,
        'mutationFn'
    >,
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
    )(options);
}
