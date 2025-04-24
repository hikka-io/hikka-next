import {
    MangaResponse,
    NovelResponse,
    ReadArgs,
    ReadContentType,
    ReadStatusEnum,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

type AddOrUpdateReadVariables = {
    contentType: ReadContentType;
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
    contentType: ReadContentType;
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

type RandomReadVariables = {
    contentType: ReadContentType;
    username: string;
    status: ReadStatusEnum;
};

/**
 * Hook for retrieving a random manga/novel from a user's read list
 */
export const useRandomRead = createMutation({
    mutationFn: <T extends MangaResponse | NovelResponse>(
        client: any,
        { contentType, username, status }: RandomReadVariables,
    ) => client.read.getRandom(contentType, username, status) as Promise<T>,
    invalidateQueries: () => [queryKeys.read.all],
});
