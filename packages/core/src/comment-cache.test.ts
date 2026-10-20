import { QueryClient } from '@tanstack/query-core';
import { describe, expect, it } from 'vitest';

import { applyCommentVote, invalidateComments } from './comment-cache';

const comment = (reference: string, my_score = 0, vote_score = 3) => ({
    reference,
    my_score,
    vote_score,
});

const page = (list: unknown[]) => ({ pages: [{ list }], pageParams: [1] });

describe('applyCommentVote', () => {
    it('patches every comment list holding the comment, and only them', async () => {
        const queryClient = new QueryClient();
        const list = [{ _id: 'getCommentsList' }];
        const thread = [{ _id: 'thread' }];
        const other = [{ _id: 'getFeed' }];
        queryClient.setQueryData(list, page([comment('a'), comment('b')]));
        queryClient.setQueryData(thread, page([comment('a')]));
        queryClient.setQueryData(other, page([comment('a')]));

        await applyCommentVote(queryClient, 'a', 1);

        expect(queryClient.getQueryData(list)).toEqual(
            page([comment('a', 1, 4), comment('b')]),
        );
        expect(queryClient.getQueryData(thread)).toEqual(
            page([comment('a', 1, 4)]),
        );
        expect(queryClient.getQueryData(other)).toEqual(page([comment('a')]));
        expect(queryClient.getQueryState(list)?.isInvalidated).toBe(true);
        expect(queryClient.getQueryState(other)?.isInvalidated).toBe(false);
    });

    it('rolls back by applying the previous score', async () => {
        const queryClient = new QueryClient();
        const key = [{ _id: 'getCommentsUser' }];
        queryClient.setQueryData(key, page([comment('a', 1, 4)]));

        await applyCommentVote(queryClient, 'a', -1);
        expect(queryClient.getQueryData(key)).toEqual(
            page([comment('a', -1, 2)]),
        );

        await applyCommentVote(queryClient, 'a', 1);
        expect(queryClient.getQueryData(key)).toEqual(
            page([comment('a', 1, 4)]),
        );
    });
});

describe('invalidateComments', () => {
    it('invalidates the comment lists and the counts on content', async () => {
        const queryClient = new QueryClient();
        for (const id of ['thread', 'animeSlug', 'getFeed']) {
            queryClient.setQueryData([{ _id: id }], {});
        }

        await invalidateComments(queryClient);

        expect(
            queryClient.getQueryState([{ _id: 'thread' }])?.isInvalidated,
        ).toBe(true);
        expect(
            queryClient.getQueryState([{ _id: 'animeSlug' }])?.isInvalidated,
        ).toBe(true);
        expect(
            queryClient.getQueryState([{ _id: 'getFeed' }])?.isInvalidated,
        ).toBe(false);
    });
});
