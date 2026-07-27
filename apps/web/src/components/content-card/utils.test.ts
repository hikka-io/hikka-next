import { describe, expect, it } from 'vitest';

import { getTooltipItem } from './utils';

// Nothing else fails loudly when a response shape drifts, so pin the contract.
describe('getTooltipItem', () => {
    const anime = {
        data_type: 'anime',
        slug: 'frieren',
        genres: [],
        watch: [],
    };
    const manga = { data_type: 'manga', slug: 'berserk', genres: [], read: [] };
    const noGenres = { data_type: 'anime', slug: 'frieren', watch: [] };
    const noTracking = { data_type: 'anime', slug: 'frieren', genres: [] };
    const character = { data_type: 'character', genres: [], read: [] };

    it('accepts a list item that carries genres and its tracking array', () => {
        expect(getTooltipItem(anime, 'anime')).toBe(anime);
        expect(getTooltipItem(manga, 'manga')).toBe(manga);
    });

    it('rejects a payload missing the body fields', () => {
        expect(getTooltipItem(noGenres, 'anime')).toBeUndefined();
    });

    it('rejects a payload missing the tracking array', () => {
        expect(getTooltipItem(noTracking, 'anime')).toBeUndefined();
    });

    it('rejects a payload of a different type than the caller expects', () => {
        expect(getTooltipItem(anime, 'manga')).toBeUndefined();
    });

    it('rejects an unknown data_type', () => {
        expect(getTooltipItem(character, 'character')).toBeUndefined();
    });

    it('tolerates a missing entity', () => {
        expect(getTooltipItem(null, 'anime')).toBeUndefined();
        expect(getTooltipItem(undefined, 'anime')).toBeUndefined();
    });
});
