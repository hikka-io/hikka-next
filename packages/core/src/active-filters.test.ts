import { describe, expect, it } from 'vitest';

import {
    getActiveFilters,
    isTristateFilter,
    removeActiveFilter,
} from './active-filters';

describe('getActiveFilters', () => {
    it('labels enums from core and dynamic params from the label maps', () => {
        const filters = getActiveFilters(
            {
                statuses: ['ongoing'],
                types: ['tv'],
                genres: ['action', '-drama'],
                seasons: ['fall'],
                ratings: ['pg_13'],
                studios: ['madhouse'],
            },
            {
                labelMaps: {
                    genres: { action: 'Екшн', drama: 'Драма' },
                    studios: undefined,
                },
            },
        );

        expect(filters.map((filter) => filter.label)).toEqual([
            'Онґоїнґ',
            'TV Серіал',
            'Екшн',
            'Драма',
            'Осінь',
            'PG-13',
            'madhouse',
        ]);
        expect(filters.find((f) => f.value === '-drama')?.excluded).toBe(true);
    });

    it('shows ranges, booleans and the date range as one chip each, in param order', () => {
        const filters = getActiveFilters({
            years: [2000, 2010],
            score: [7, 10],
            only_translated: true,
            date_range_enabled: true,
            date_range: [-1, 0],
            sort: 'score',
            order: 'desc',
            search: 'frieren',
            page: 2,
        });

        expect(filters).toEqual([
            { param: 'years', value: '2000,2010', label: '2000–2010' },
            { param: 'score', value: '7,10', label: '7–10' },
            {
                param: 'only_translated',
                value: 'true',
                label: 'Перекладено українською',
            },
            {
                param: 'date_range_enabled',
                value: 'true',
                label: 'Часовий проміжок',
            },
        ]);
    });

    it('shows hide_listed only with a session', () => {
        expect(getActiveFilters({ hide_listed: true })).toEqual([]);
        expect(
            getActiveFilters({ hide_listed: true }, { signedIn: true }),
        ).toHaveLength(1);
    });

    it('carries the value of value params', () => {
        expect(getActiveFilters({ mal_id: 47128 })[0]?.label).toBe(
            'MAL ID: 47128',
        );
    });

    it('marks genres and issues as tri-state', () => {
        expect(isTristateFilter('genres')).toBe(true);
        expect(isTristateFilter('issues')).toBe(true);
        expect(isTristateFilter('studios')).toBe(false);
    });
});

describe('removeActiveFilter', () => {
    it('removes one value of a list and the page', () => {
        const search = { genres: ['action', '-drama'], page: 2 };
        const [, drama] = getActiveFilters(search);

        expect(drama && removeActiveFilter(search, drama)).toEqual({
            genres: ['action'],
        });
    });

    it('drops a list param when its last value goes', () => {
        const search = { statuses: ['ongoing'] };
        const [status] = getActiveFilters(search);

        expect(status && removeActiveFilter(search, status)).toEqual({});
    });

    it('removes the date range together with its switch', () => {
        const search = {
            date_range_enabled: true,
            date_range: [-1, 0],
            years: [2000, 2010],
        };
        const dateRange = getActiveFilters(search).find(
            (f) => f.param === 'date_range_enabled',
        );

        expect(dateRange && removeActiveFilter(search, dateRange)).toEqual({
            years: [2000, 2010],
        });
    });

    it('drops a range param', () => {
        const search = { score: [7, 10] };
        const [score] = getActiveFilters(search);

        expect(score && removeActiveFilter(search, score)).toEqual({});
    });
});
