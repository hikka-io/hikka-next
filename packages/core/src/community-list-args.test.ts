import { describe, expect, it } from 'vitest';

import {
    articleListArgs,
    articlesSearchFromParams,
    collectionListArgs,
    contentArticlesListArgs,
    contentCollectionsListArgs,
    PUBLIC_ARTICLE_CATEGORIES,
    userArticlesListArgs,
    userCollectionsListArgs,
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

describe('articlesSearchFromParams', () => {
    it('reads plain, repeated and JSON-encoded params like the web router writes them', () => {
        expect(
            articlesSearchFromParams({
                categories: 'news',
                author: 'olexh',
                tags: '["аніме","огляд"]',
                sort: 'vote_score',
                order: 'asc',
            }),
        ).toMatchObject({
            categories: ['news'],
            author: 'olexh',
            tags: ['аніме', 'огляд'],
            sort: 'vote_score',
            order: 'asc',
        });
        expect(
            articlesSearchFromParams({ categories: ['news', 'reviews'] })
                .categories,
        ).toEqual(['news', 'reviews']);
        expect(articlesSearchFromParams({ author: '"123"' }).author).toBe(
            '123',
        );
    });

    it('drops values the schema rejects', () => {
        expect(articlesSearchFromParams({ order: 'sideways' }).order).toBe(
            undefined,
        );
        expect(articlesSearchFromParams({ tags: '[oops' }).tags).toEqual([
            '[oops',
        ]);
    });
});

describe('PUBLIC_ARTICLE_CATEGORIES', () => {
    it('leaves out the staff-only system category', () => {
        expect(PUBLIC_ARTICLE_CATEGORIES).not.toContain('system');
        expect(PUBLIC_ARTICLE_CATEGORIES).toContain('news');
    });
});

describe('user profile list args', () => {
    it("lists a user's collections newest first, private ones included", () => {
        expect(userCollectionsListArgs('olexh')).toEqual({
            author: 'olexh',
            sort: ['created:desc'],
            only_public: false,
        });
    });

    it("lists a user's articles by author alone", () => {
        expect(userArticlesListArgs('olexh')).toEqual({ author: 'olexh' });
    });
});

describe('content list args', () => {
    it('filters collections by one entry', () => {
        expect(contentCollectionsListArgs('character', 'c1')).toEqual({
            content_type: 'character',
            content: ['c1'],
        });
    });

    it('filters articles by one title', () => {
        expect(contentArticlesListArgs('anime', 'a1')).toEqual({
            content_type: 'anime',
            content_slug: 'a1',
        });
    });
});
