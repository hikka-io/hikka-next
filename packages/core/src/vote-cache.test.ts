import { QueryClient } from '@tanstack/query-core';
import { describe, expect, it } from 'vitest';

import {
    getArticleQueryKey,
    getCollectionQueryKey,
    getVoteQueryKey,
    VoteContentTypeEnum,
} from '@hikka/api';

import { applyVoteMutation, nextVoteScore, optimisticVote } from './vote-cache';

const invalidated = (queryClient: QueryClient) =>
    queryClient
        .getQueryCache()
        .getAll()
        .filter((query) => query.state.isInvalidated)
        .map((query) => query.queryKey[0]);

describe('applyVoteMutation', () => {
    it('stores the vote and refreshes that article only', async () => {
        const queryClient = new QueryClient();
        const article = getArticleQueryKey({ path: { slug: 'a' } });
        const other = getArticleQueryKey({ path: { slug: 'b' } });
        queryClient.setQueryData(article, {});
        queryClient.setQueryData(other, {});
        const target = { content_type: VoteContentTypeEnum.ARTICLE, slug: 'a' };

        await applyVoteMutation(queryClient, target, { score: 1 });

        expect(
            queryClient.getQueryData(getVoteQueryKey({ path: target })),
        ).toEqual({ score: 1 });
        expect(invalidated(queryClient)).toEqual([article[0]]);
    });

    it('refreshes a collection by its reference', async () => {
        const queryClient = new QueryClient();
        const collection = getCollectionQueryKey({
            path: { reference: 'ref' },
        });
        queryClient.setQueryData(collection, {});

        await applyVoteMutation(
            queryClient,
            { content_type: VoteContentTypeEnum.COLLECTION, slug: 'ref' },
            { score: -1 },
        );

        expect(invalidated(queryClient)).toEqual([collection[0]]);
    });

    it('stores a vote for a type without a detail query and invalidates nothing', async () => {
        const queryClient = new QueryClient();
        const article = getArticleQueryKey({ path: { slug: 'x' } });
        queryClient.setQueryData(article, {});
        // Outside the typed vote targets: the guard keeps a stray value from throwing.
        const target = {
            content_type: 'anime' as VoteContentTypeEnum,
            slug: 'x',
        };

        await expect(
            applyVoteMutation(queryClient, target, { score: 1 }),
        ).resolves.toBeUndefined();

        expect(
            queryClient.getQueryData(getVoteQueryKey({ path: target })),
        ).toEqual({ score: 1 });
        expect(invalidated(queryClient)).toEqual([]);
    });
});

describe('optimisticVote', () => {
    it('counts a pending vote at once', () => {
        expect(optimisticVote(0, 10, 1)).toEqual({ myScore: 1, voteScore: 11 });
        expect(optimisticVote(1, 10, -1)).toEqual({
            myScore: -1,
            voteScore: 8,
        });
        expect(optimisticVote(1, 10, undefined)).toEqual({
            myScore: 1,
            voteScore: 10,
        });
    });
});

describe('nextVoteScore', () => {
    it('clears the vote when the active direction is pressed again', () => {
        expect(nextVoteScore(1, 1)).toBe(0);
        expect(nextVoteScore(-1, 1)).toBe(1);
        expect(nextVoteScore(0, -1)).toBe(-1);
    });
});
