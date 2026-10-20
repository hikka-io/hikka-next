import { describe, expect, it } from 'vitest';

import {
    articleListArgs,
    collectionListArgs,
    PUBLIC_ARTICLE_CATEGORIES,
} from './community-list-args';
import { nextVoteScore, optimisticVote } from './vote-cache';

describe('collectionListArgs', () => {
    it('sorts by ranking by default', () => {
        expect(collectionListArgs()).toEqual({
            sort: ['system_ranking:desc'],
        });
        expect(collectionListArgs('created')).toEqual({
            sort: ['created:desc'],
        });
    });
});

describe('articleListArgs', () => {
    it('fills the defaults of an empty search', () => {
        expect(articleListArgs({})).toEqual({
            categories: [],
            author: undefined,
            sort: ['created:desc'],
            tags: undefined,
            draft: false,
        });
    });

    it('passes categories, tags, sort and order', () => {
        expect(
            articleListArgs({
                categories: ['news'],
                tags: ['anime'],
                sort: 'vote_score',
                order: 'asc',
            }),
        ).toMatchObject({
            categories: ['news'],
            tags: ['anime'],
            sort: ['vote_score:asc'],
        });
    });
});

describe('PUBLIC_ARTICLE_CATEGORIES', () => {
    it('leaves out the staff-only system category', () => {
        expect(PUBLIC_ARTICLE_CATEGORIES).not.toContain('system');
        expect(PUBLIC_ARTICLE_CATEGORIES).toContain('news');
    });
});

describe('vote helpers', () => {
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

    it('clears the vote when the active direction is pressed again', () => {
        expect(nextVoteScore(1, 1)).toBe(0);
        expect(nextVoteScore(-1, 1)).toBe(1);
        expect(nextVoteScore(0, -1)).toBe(-1);
    });
});
