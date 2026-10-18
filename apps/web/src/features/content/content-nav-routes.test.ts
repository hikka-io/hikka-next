import { describe, expect, it } from 'vitest';

import { findCurrentNavRoute } from '@/utils/navigation';

import { contentNavRoutes, hasContentNav } from './content-nav-routes';

const SLUG = 'shingeki-no-kyojin-0cf69a';
const ROUTES = contentNavRoutes('anime', SLUG);

describe('contentNavRoutes', () => {
    it('builds absolute section links with the comments page last', () => {
        expect(ROUTES.map((route) => route.url)).toEqual([
            `/anime/${SLUG}`,
            `/anime/${SLUG}/characters`,
            `/anime/${SLUG}/franchise`,
            `/anime/${SLUG}/media`,
            `/anime/${SLUG}/staff`,
            `/comments/anime/${SLUG}`,
        ]);
    });

    it('covers only the types with sections', () => {
        expect(hasContentNav('person')).toBe(true);
        expect(hasContentNav('collection')).toBe(false);
        expect(hasContentNav('constructor')).toBe(false);
    });
});

describe('findCurrentNavRoute', () => {
    it.each([
        [`/anime/${SLUG}`, 'general'],
        [`/anime/${SLUG}/characters`, 'characters'],
        [`/comments/anime/${SLUG}`, 'comments'],
        [`/comments/anime/${SLUG}/a1b2c3`, 'comments'],
    ])('matches %s to the %s section', (pathname, slug) => {
        expect(findCurrentNavRoute(ROUTES, pathname)?.slug).toBe(slug);
    });

    it('does not treat a longer slug as a nested path', () => {
        expect(
            findCurrentNavRoute(ROUTES, `/anime/${SLUG}-movie`),
        ).toBeUndefined();
    });

    it('resolves relative routes against a prefix', () => {
        const relative = [
            { slug: 'profile', title_ua: 'Профіль', url: '' },
            { slug: 'anime', title_ua: 'Аніме', url: '/list/anime' },
        ];

        expect(
            findCurrentNavRoute(relative, '/u/someone/list/anime', '/u/someone')
                ?.slug,
        ).toBe('anime');
    });
});
