import { describe, expect, it } from 'vitest';

import { findMovieBanner, MOVIE_BANNERS } from './movie-banners';

const START = 1_900_000_000;
const END = 1_900_864_000;

const BANNER = {
    slug: 'movie-slug-abc123',
    title: 'Title',
    description: 'Description',
    duration: [START, END] as [number, number],
};

const OTHER = { ...BANNER, slug: 'other-movie-def456' };

describe('MOVIE_BANNERS', () => {
    it('ships no movie banner', () => {
        expect(MOVIE_BANNERS).toEqual([]);
    });

    it('finds no banner for the formerly listed movie', () => {
        expect(
            findMovieBanner('chainsaw-man-movie-reze-hen-c4febd', 1761500000),
        ).toBeUndefined();
    });
});

describe('findMovieBanner', () => {
    it('finds the banner for the slug inside its window', () => {
        expect(findMovieBanner(BANNER.slug, START + 60, [OTHER, BANNER])).toBe(
            BANNER,
        );
    });

    it.each([
        ['the first second', START],
        ['the last second', END],
    ])('includes %s', (_, timestamp) => {
        expect(findMovieBanner(BANNER.slug, timestamp, [BANNER])).toBe(BANNER);
    });

    it.each([
        ['before the window', START - 1],
        ['after the window', END + 1],
    ])('finds nothing %s', (_, timestamp) => {
        expect(
            findMovieBanner(BANNER.slug, timestamp, [BANNER]),
        ).toBeUndefined();
    });

    it('finds nothing for another slug', () => {
        expect(
            findMovieBanner('unrelated-slug', START + 60, [BANNER]),
        ).toBeUndefined();
    });
});
