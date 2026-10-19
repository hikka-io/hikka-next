import { describe, expect, it } from 'vitest';

import { resolveLink } from './links';

describe('in-app routes', () => {
    it.each([
        ['https://hikka.io/anime/re-zero-4-a1b2c3', '/anime/re-zero-4-a1b2c3'],
        ['https://hikka.io/manga/berserk-4f2d1c', '/manga/berserk-4f2d1c'],
        ['https://hikka.io/novel/slug', '/novel/slug'],
        ['https://hikka.io/characters/emilia-abc', '/characters/emilia-abc'],
        ['https://hikka.io/people/person-abc', '/people/person-abc'],
        ['https://hikka.io/u/olexh', '/u/olexh'],
        ['https://hikka.io/anime/slug/', '/anime/slug'],
        ['https://www.hikka.io/anime/slug?x=1#top', '/anime/slug'],
        ['/anime/slug', '/anime/slug'],
    ])('maps %s', (href, route) => {
        expect(resolveLink(href)).toEqual({ kind: 'route', href: route });
    });

    it('opens other hikka.io pages in the browser', () => {
        expect(resolveLink('https://hikka.io/anime/slug/characters')).toEqual({
            kind: 'external',
            url: 'https://hikka.io/anime/slug/characters',
            trusted: true,
            authOnly: false,
        });
    });
});

describe('external links', () => {
    it('trusts the listed hosts and their subdomains', () => {
        expect(resolveLink('https://myanimelist.net/anime/1')).toMatchObject({
            kind: 'external',
            trusted: true,
            authOnly: false,
        });
        expect(resolveLink('https://www.anilist.co/x')).toMatchObject({
            trusted: true,
        });
    });

    it('marks hosts that need a signed-in user', () => {
        expect(resolveLink('https://toloka.to/t1')).toMatchObject({
            trusted: true,
            authOnly: true,
        });
        expect(resolveLink('https://anitube.in.ua/1')).toMatchObject({
            authOnly: true,
        });
    });

    it('asks before opening unknown hosts', () => {
        expect(resolveLink('https://example.com/a')).toMatchObject({
            kind: 'external',
            trusted: false,
            authOnly: false,
        });
    });

    it('does not trust a lookalike host', () => {
        expect(resolveLink('https://evil-anilist.co.example/x')).toMatchObject({
            trusted: false,
        });
        expect(resolveLink('https://notmyanimelist.net/x')).toMatchObject({
            trusted: false,
        });
    });

    it.each(['javascript:alert(1)', 'mailto:a@b.c', 'tel:123', ''])(
        'ignores %j',
        (href) => {
            expect(resolveLink(href).kind).not.toBe('external');
        },
    );
});
