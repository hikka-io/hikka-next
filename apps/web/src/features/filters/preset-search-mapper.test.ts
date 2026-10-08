import { describe, expect, it } from 'vitest';

import { ContentTypeEnum } from '@hikka/api';

import { presetFromSearch, presetToSearch } from './preset-search-mapper';
import type { FilterPreset } from './presets/types';

const FULL_SEARCH = {
    statuses: ['finished', 'ongoing'],
    seasons: ['winter'],
    types: ['tv'],
    genres: ['action'],
    ratings: ['pg_13'],
    studios: ['studio-slug'],
    years: [2010, 2020],
    score: [6, 9],
    date_range: [-2, 0],
    only_translated: true,
    date_range_enabled: false,
    sort: 'score',
    order: 'desc',
};

describe('presetFromSearch', () => {
    it('copies every filter param, including the score range', () => {
        expect(presetFromSearch(FULL_SEARCH, ContentTypeEnum.ANIME)).toEqual({
            name: '',
            description: '',
            content_types: [ContentTypeEnum.ANIME],
            ...FULL_SEARCH,
        });
    });

    it('starts an empty search with only the page content type', () => {
        expect(presetFromSearch({}, ContentTypeEnum.MANGA)).toEqual({
            name: '',
            description: '',
            content_types: [ContentTypeEnum.MANGA],
        });
    });

    it('skips empty lists and empty text', () => {
        expect(
            presetFromSearch(
                { genres: [], score: [], sort: '', order: '' },
                ContentTypeEnum.ANIME,
            ),
        ).toEqual({
            name: '',
            description: '',
            content_types: [ContentTypeEnum.ANIME],
        });
    });

    it('coerces raw url values', () => {
        expect(
            presetFromSearch(
                {
                    genres: 'action',
                    score: ['3', '8'],
                    years: '2020',
                    only_translated: 'true',
                    date_range_enabled: 'false',
                },
                ContentTypeEnum.ANIME,
            ),
        ).toMatchObject({
            genres: ['action'],
            score: [3, 8],
            years: [2020],
            only_translated: true,
            date_range_enabled: false,
        });
    });

    it('ignores the text query, the page and unknown params', () => {
        const preset = presetFromSearch(
            { search: 'naruto', page: 3, tab: 'x', score: [2, 7] },
            ContentTypeEnum.ANIME,
        );

        expect(preset).not.toHaveProperty('search');
        expect(preset).not.toHaveProperty('page');
        expect(preset).not.toHaveProperty('tab');
        expect(preset.score).toEqual([2, 7]);
    });

    it('keeps content types from the search over the page content type', () => {
        expect(
            presetFromSearch(
                { content_types: ['manga', 'novel'] },
                ContentTypeEnum.ANIME,
            ).content_types,
        ).toEqual(['manga', 'novel']);
    });
});

describe('presetToSearch', () => {
    it('round-trips a search through a preset', () => {
        const preset = {
            id: 'id',
            ...presetFromSearch(FULL_SEARCH, ContentTypeEnum.ANIME),
        } as FilterPreset;

        expect(presetToSearch(preset)).toEqual(FULL_SEARCH);
    });

    it('round-trips an empty search', () => {
        const preset = {
            id: 'id',
            ...presetFromSearch({}, ContentTypeEnum.NOVEL),
        } as FilterPreset;

        expect(presetToSearch(preset)).toEqual({});
    });

    it('applies a preset saved without a score unchanged', () => {
        const legacy: FilterPreset = {
            id: 'legacy',
            name: 'Legacy',
            description: 'Saved before score was copied',
            content_types: [ContentTypeEnum.ANIME],
            statuses: ['finished'],
            genres: ['action'],
            years: [2000, 2010],
            only_translated: true,
            sort: 'score',
            order: 'desc',
        };
        const { id, name, description, content_types, ...rest } = legacy;

        expect(presetToSearch(legacy)).toEqual(rest);
        expect(presetToSearch(legacy)).not.toHaveProperty('score');
    });

    it('applies the saved score range', () => {
        expect(
            presetToSearch({
                id: 'id',
                name: 'Top',
                content_types: [ContentTypeEnum.MANGA],
                score: [8, 10],
            }),
        ).toEqual({ score: [8, 10] });
    });

    it("follows the preset's own key order", () => {
        const preset = {
            sort: 'score',
            id: 'id',
            score: [6, 9],
            name: 'name',
            genres: ['action'],
            content_types: [ContentTypeEnum.ANIME],
            only_translated: true,
            statuses: ['finished'],
            future_key: ['kept in storage only'],
            years: [2010, 2020],
            order: 'desc',
        } as FilterPreset;

        expect(Object.keys(presetToSearch(preset))).toEqual([
            'sort',
            'score',
            'genres',
            'only_translated',
            'statuses',
            'years',
            'order',
        ]);
    });

    it('drops preset metadata, empty values and unknown keys', () => {
        const preset = {
            id: 'id',
            name: 'name',
            description: 'description',
            content_types: [ContentTypeEnum.ANIME],
            date_range: null,
            years: undefined,
            only_translated: false,
            future_key: ['kept in storage only'],
        } as FilterPreset;

        expect(presetToSearch(preset)).toEqual({ only_translated: false });
    });
});
