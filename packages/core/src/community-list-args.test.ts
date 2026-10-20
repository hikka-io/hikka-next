import { describe, expect, it } from 'vitest';

import {
    articleListArgs,
    collectionListArgs,
    PUBLIC_ARTICLE_CATEGORIES,
} from './community-list-args';

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
