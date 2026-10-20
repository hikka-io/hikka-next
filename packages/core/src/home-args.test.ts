import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    getArticlesArgs,
    getCollectionsArgs,
    getFeedItemCommentsPath,
    getFeedItemPath,
    getOngoingsArgs,
    getScheduleArgs,
} from './home-args';

afterEach(() => vi.useRealTimers());

describe('home args', () => {
    it('builds the seasonal ongoings search', () => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-09-29T12:00:00'));

        expect(getOngoingsArgs()).toMatchObject({
            season: ['summer'],
            media_type: ['tv'],
            years: [2026, 2026],
            status: ['ongoing'],
        });
    });

    it('defaults the schedule to the current season and airing statuses', () => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-09-29T12:00:00'));

        expect(getScheduleArgs({})).toEqual({
            airing_season: ['summer', 2026],
            status: ['ongoing', 'announced'],
            only_watch: undefined,
        });
    });

    it('picks collection and article sorts per tab', () => {
        expect(getCollectionsArgs('popular').sort).toEqual([
            'system_ranking:desc',
            'created:desc',
        ]);
        expect(getCollectionsArgs('own', 'me')).toMatchObject({
            author: 'me',
            only_public: false,
        });
        expect(getCollectionsArgs('own').sort).toEqual(['created:desc']);
        expect(getArticlesArgs('popular').sort).toEqual(['vote_score:desc']);
        expect(getArticlesArgs('own', 'me')).toMatchObject({ author: 'me' });
    });

    it('builds item and comments paths', () => {
        const article = { data_type: 'article', slug: 'a' } as never;
        const comment = {
            data_type: 'comment',
            reference: 'r',
            content_type: 'anime',
            preview: { slug: 's' },
        } as never;

        expect(getFeedItemPath(article)).toBe('/articles/a');
        expect(getFeedItemCommentsPath(article)).toBe('/comments/article/a');
        expect(getFeedItemPath(comment)).toBe('/comments/anime/s/r');
    });
});
