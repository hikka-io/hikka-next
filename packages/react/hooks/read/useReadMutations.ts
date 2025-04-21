import { ReadArgs, ReadContentTypeEnum } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

type AddOrUpdateReadVariables = {
    contentType: ReadContentTypeEnum;
    slug: string;
    args: ReadArgs;
};

/**
 * Hook for adding or updating a read entry
 */
export const useAddOrUpdateRead = createMutation({
    mutationFn: (
        client,
        { contentType, slug, args }: AddOrUpdateReadVariables,
    ) => client.read.addOrUpdate(contentType, slug, args),
    invalidateQueries: ({ contentType, slug }) => [
        queryKeys.read.entry(contentType, slug),
        queryKeys.read.all,
    ],
});

type DeleteReadVariables = {
    contentType: ReadContentTypeEnum;
    slug: string;
};

/**
 * Hook for deleting a read entry
 */
export const useDeleteRead = createMutation({
    mutationFn: (client, { contentType, slug }: DeleteReadVariables) =>
        client.read.delete(contentType, slug),
    invalidateQueries: ({ contentType, slug }) => [
        queryKeys.read.entry(contentType, slug),
        queryKeys.read.all,
    ],
});
