import { describe, expect, it } from 'vitest';

import { ContentTypeEnum } from '@hikka/api';
import { getSeasonByOffset } from '@hikka/core';

import { catalogSearchArgs, catalogSearchOptions } from './queries';

describe('catalogSearchArgs', () => {
    it('sends the default sort with empty filters', () => {
        expect(catalogSearchArgs(ContentTypeEnum.ANIME, {}, false)).toEqual({
            query: undefined,
            media_type: [],
            status: [],
            season: [],
            rating: [],
            years: [],
            genres: [],
            studios: [],
            score: undefined,
            only_translated: false,
            sort: ['score:desc', 'scored_by:desc'],
        });
    });

    it('maps anime filters to the request body', () => {
        const args = catalogSearchArgs(
            ContentTypeEnum.ANIME,
            {
                genres: ['action', '-drama'],
                statuses: ['ongoing'],
                types: ['tv'],
                seasons: ['fall'],
                ratings: ['pg_13'],
                studios: ['madhouse'],
                years: [2000, 2010],
                score: [7, 10],
                only_translated: true,
                sort: 'start_date',
                order: 'asc',
            },
            false,
        );

        expect(args).toMatchObject({
            genres: ['action', '-drama'],
            status: ['ongoing'],
            media_type: ['tv'],
            season: ['fall'],
            rating: ['pg_13'],
            studios: ['madhouse'],
            years: [2000, 2010],
            score: [7, 10],
            only_translated: true,
            sort: ['start_date:asc'],
        });
    });

    it('turns a date range into season bounds', () => {
        const args = catalogSearchArgs(
            ContentTypeEnum.ANIME,
            { date_range_enabled: true, date_range: [-1, 0] },
            false,
        );

        expect(args.years).toEqual([
            getSeasonByOffset(-1),
            getSeasonByOffset(0),
        ]);
    });

    it('drops anime-only filters for manga and novel', () => {
        for (const type of [ContentTypeEnum.MANGA, ContentTypeEnum.NOVEL]) {
            const args = catalogSearchArgs(
                type,
                {
                    seasons: ['fall'],
                    studios: ['madhouse'],
                    types: ['manga'],
                    sort: 'native_score',
                },
                false,
            );

            expect(args).not.toHaveProperty('season');
            expect(args).not.toHaveProperty('studios');
            expect(args).toMatchObject({
                media_type: ['manga'],
                sort: ['native_score:desc', 'native_scored_by:desc'],
            });
        }
    });

    it('excludes every list status only for a signed-in viewer', () => {
        const search = { hide_listed: true };

        expect(
            catalogSearchArgs(ContentTypeEnum.ANIME, search, false),
        ).not.toHaveProperty('exclude_watch_status');
        expect(
            catalogSearchArgs(ContentTypeEnum.ANIME, search, true),
        ).toHaveProperty('exclude_watch_status.length', 5);
        expect(
            catalogSearchArgs(ContentTypeEnum.NOVEL, search, true),
        ).toHaveProperty('exclude_read_status');
    });
});

describe('catalogSearchOptions', () => {
    it('keys each type and filter set separately', () => {
        const anime = catalogSearchOptions(ContentTypeEnum.ANIME, {}, false);
        const manga = catalogSearchOptions(ContentTypeEnum.MANGA, {}, false);
        const filtered = catalogSearchOptions(
            ContentTypeEnum.ANIME,
            { genres: ['action'] },
            false,
        );

        expect(anime.queryKey).not.toEqual(manga.queryKey);
        expect(anime.queryKey).not.toEqual(filtered.queryKey);
        expect(anime.initialPageParam).toBe(1);
    });
});
