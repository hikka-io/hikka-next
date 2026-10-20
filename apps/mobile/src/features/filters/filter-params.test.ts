import { describe, expect, it } from 'vitest';

import { DATE_RANGE } from '@hikka/core';

import {
    clearFilters,
    cycleGenre,
    genreState,
    setDateRangeEnabled,
    setParam,
    toggleValue,
} from './filter-params';

describe('setParam', () => {
    it('sets a value and resets the page', () => {
        expect(setParam({ page: 3 }, 'statuses', ['ongoing'])).toEqual({
            statuses: ['ongoing'],
        });
    });

    it.each([[[]], [false], [''], [null], [undefined]])(
        'drops the param for the empty value %j',
        (value) => {
            expect(
                setParam(
                    { only_translated: true, statuses: ['ongoing'] },
                    'only_translated',
                    value as never,
                ),
            ).toEqual({ statuses: ['ongoing'] });
        },
    );
});

describe('toggleValue', () => {
    it('adds a missing value and removes a present one', () => {
        expect(toggleValue(undefined, 'tv')).toEqual(['tv']);
        expect(toggleValue(['tv', 'movie'], 'tv')).toEqual(['movie']);
    });
});

describe('genre tri-state', () => {
    it('cycles neutral, include, exclude, neutral', () => {
        const included = cycleGenre(['drama'], 'action');
        const excluded = cycleGenre(included, 'action');
        const cleared = cycleGenre(excluded, 'action');

        expect(included).toEqual(['drama', 'action']);
        expect(excluded).toEqual(['drama', '-action']);
        expect(cleared).toEqual(['drama']);
    });

    it('reads the state of a slug', () => {
        expect(genreState(['action', '-drama'], 'action')).toBe('include');
        expect(genreState(['action', '-drama'], 'drama')).toBe('exclude');
        expect(genreState(undefined, 'drama')).toBeUndefined();
    });
});

describe('clearFilters', () => {
    it('keeps the query and the sort, drops filters and the page', () => {
        expect(
            clearFilters({
                search: 'frieren',
                sort: 'start_date',
                order: 'asc',
                genres: ['action'],
                years: [2000, 2010],
                only_translated: true,
                page: 2,
            }),
        ).toEqual({ search: 'frieren', sort: 'start_date', order: 'asc' });
    });
});

describe('setDateRangeEnabled', () => {
    it('applies the full range and drops the season and year filters it hides', () => {
        expect(
            setDateRangeEnabled(
                {
                    seasons: ['fall'],
                    years: [2000, 2010],
                    genres: ['action'],
                    page: 2,
                },
                true,
            ),
        ).toEqual({
            genres: ['action'],
            date_range: DATE_RANGE,
            date_range_enabled: true,
        });
    });

    it('removes the range with the switch', () => {
        expect(
            setDateRangeEnabled(
                { date_range_enabled: true, date_range: [-1, 0] },
                false,
            ),
        ).toEqual({});
    });
});
