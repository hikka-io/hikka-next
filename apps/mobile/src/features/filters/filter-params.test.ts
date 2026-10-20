import { describe, expect, it } from 'vitest';

import {
    clearFilters,
    cycleGenre,
    genreState,
    getActiveFilters,
    removeFilter,
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

describe('getActiveFilters', () => {
    it('labels enums from core and genres from the names map', () => {
        const filters = getActiveFilters(
            {
                statuses: ['ongoing'],
                types: ['tv'],
                genres: ['action', '-drama'],
                seasons: ['fall'],
                ratings: ['pg_13'],
            },
            { names: { action: 'Екшн', drama: 'Драма' } },
        );

        expect(filters.map((filter) => filter.label)).toEqual([
            'Екшн',
            'Драма',
            'Онґоїнґ',
            'TV Серіал',
            'Осінь',
            'PG-13',
        ]);
        expect(filters.find((f) => f.value === '-drama')?.excluded).toBe(true);
    });

    it('shows ranges, booleans and the date range as one chip each', () => {
        const filters = getActiveFilters({
            years: [2000, 2010],
            score: [7, 10],
            only_translated: true,
            date_range_enabled: true,
            date_range: [-1, 0],
            sort: 'score',
            page: 2,
        });

        expect(filters.map((filter) => filter.label)).toEqual([
            'Часовий проміжок',
            '2000–2010',
            'Оцінка 7–10',
            'Перекладено українською',
        ]);
    });

    it('shows hide_listed only with a session', () => {
        expect(getActiveFilters({ hide_listed: true })).toEqual([]);
        expect(
            getActiveFilters({ hide_listed: true }, { signedIn: true }),
        ).toHaveLength(1);
    });
});

describe('removeFilter', () => {
    it('removes one value of a list', () => {
        const search = { genres: ['action', '-drama'], page: 2 };
        const [, drama] = getActiveFilters(search);

        expect(removeFilter(search, drama)).toEqual({ genres: ['action'] });
    });

    it('removes the date range together with its switch', () => {
        const search = {
            date_range_enabled: true,
            date_range: [-1, 0],
            years: [2000, 2010],
        };
        const [dateRange] = getActiveFilters(search);

        expect(removeFilter(search, dateRange)).toEqual({
            years: [2000, 2010],
        });
    });

    it('drops a range param', () => {
        const search = { score: [7, 10] };
        const [score] = getActiveFilters(search);

        expect(removeFilter(search, score)).toEqual({});
    });
});
