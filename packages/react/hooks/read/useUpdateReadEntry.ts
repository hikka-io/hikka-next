import { ReadArgs, ReadContentTypeEnum, ReadResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type UpdateReadEntryVariables = {
    contentType: ReadContentTypeEnum;
    slug: string;
    args: ReadArgs;
};

export interface UseUpdateReadEntryOptions
    extends Omit<
        UseMutationOptions<ReadResponse, Error, UpdateReadEntryVariables>,
        'mutationFn'
    > {}

/**
 * Hook for adding or updating a read entry
 */
export function useUpdateReadEntry(
    params: UseUpdateReadEntryOptions = {},
): UseMutationResult<ReadResponse, Error, UpdateReadEntryVariables> {
    return createMutation<ReadResponse, Error, UpdateReadEntryVariables>(
        (client, { contentType, slug, args }) =>
            client.read.addOrUpdate(contentType, slug, args),
        (variables) => [
            // Invalidate the specific read entry
            queryKeys.read.get(variables.contentType, variables.slug),
            // Invalidate read lists in general
            queryKeys.read.list(variables.contentType, '', {}),
            // Invalidate read stats
            queryKeys.read.stats(variables.contentType, ''),
        ],
    )(params);
}
