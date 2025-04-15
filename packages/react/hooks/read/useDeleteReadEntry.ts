import { ReadContentTypeEnum, SuccessResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type DeleteReadEntryVariables = {
    contentType: ReadContentTypeEnum;
    slug: string;
};

/**
 * Hook for deleting a read entry
 */
export function useDeleteReadEntry(
    options?: Omit<
        UseMutationOptions<SuccessResponse, Error, DeleteReadEntryVariables>,
        'mutationFn'
    >,
): UseMutationResult<SuccessResponse, Error, DeleteReadEntryVariables> {
    return createMutation<SuccessResponse, Error, DeleteReadEntryVariables>(
        (client, { contentType, slug }) =>
            client.read.delete(contentType, slug),
        (variables) => [
            // Invalidate the specific read entry
            queryKeys.read.get(variables.contentType, variables.slug),
            // Invalidate read lists in general
            queryKeys.read.list(variables.contentType, '', {}),
            // Invalidate read stats
            queryKeys.read.stats(variables.contentType, ''),
        ],
    )(options);
}
