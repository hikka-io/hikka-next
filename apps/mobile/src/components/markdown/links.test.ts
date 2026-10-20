import { describe, expect, it } from 'vitest';

import { resolveImageUrl, resolveLink } from './links';

describe('in-app routes', () => {
    it.each([
        ['https://hikka.io/anime/re-zero-4-a1b2c3', '/anime/re-zero-4-a1b2c3'],
        ['https://hikka.io/anime/slug/', '/anime/slug'],
        ['https://www.hikka.io/anime/slug?x=1#top', '/anime/slug'],
        ['/anime/slug', '/anime/slug'],
        ['https://hikka.io/manga/berserk-4f2d1c', '/manga/berserk-4f2d1c'],
        ['https://hikka.io/novel/slug', '/novel/slug'],
        ['https://hikka.io/characters/emilia-abc', '/characters/emilia-abc'],
        ['https://hikka.io/people/person-abc/', '/people/person-abc'],
        ['https://hikka.io/u/olexh?tab=1', '/u/olexh'],
        [
            'https://hikka.io/collections/3f29e8e2-517a-45b8-b9da-7cd44fb80de9',
            '/collections/3f29e8e2-517a-45b8-b9da-7cd44fb80de9',
        ],
        ['https://hikka.io/collections', '/collections'],
        [
            'https://hikka.io/articles/hikka-oauth-ebbd59',
            '/articles/hikka-oauth-ebbd59',
        ],
        [
            'https://hikka.io/articles?categories=news',
            '/articles?categories=news',
        ],
        ['https://hikka.io/comments/latest', '/comments/latest'],
        ['https://hikka.io/comments/my/', '/comments/my'],
        ['https://hikka.io/comments/anime/slug', '/comments/anime/slug'],
        ['https://hikka.io/comments/user/olexh', '/comments/user/olexh'],
        [
            'https://hikka.io/comments/anime/slug/0b8b2c1e-1d1e-4a52-9d2a-1f7a6c2b9e10',
            '/comments/anime/slug/0b8b2c1e-1d1e-4a52-9d2a-1f7a6c2b9e10',
        ],
        ['https://hikka.io/schedule', '/schedule'],
        ['https://hikka.io/schedule/?season=winter', '/schedule'],
        ['https://hikka.io/u/olexh/history', '/u/olexh/history'],
        [
            'https://hikka.io/u/olexh/history?type=following',
            '/u/olexh/history?type=following',
        ],
        [
            'https://hikka.io/u/olexh/favorites?type=person&x=1',
            '/u/olexh/favorites?type=person',
        ],
        ['https://hikka.io/u/olexh/list/anime', '/u/olexh/list/anime'],
        [
            'https://hikka.io/u/olexh/list/manga?status=planned&sort=read_score',
            '/u/olexh/list/manga?status=planned',
        ],
    ])('maps %s', (href, route) => {
        expect(resolveLink(href)).toEqual({ kind: 'route', href: route });
    });

    it.each([
        'https://hikka.io/anime/slug/characters',
        'https://hikka.io/characters/emilia-abc/anime',
        'https://hikka.io/anime',
        'https://hikka.io/collections/abc/update',
        'https://hikka.io/articles/new',
        'https://hikka.io/comments/anime/slug/ref/extra',
        'https://hikka.io/comments',
        'https://hikka.io/settings',
        'https://hikka.io/u/olexh/list/character',
        'https://hikka.io/u/olexh/articles',
    ])('opens %s in the browser until its route exists', (href) => {
        expect(resolveLink(href)).toEqual({
            kind: 'external',
            url: href,
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

    it('treats a protocol-relative url as an unknown external host', () => {
        expect(resolveLink('//evil.example/x')).toEqual({
            kind: 'external',
            url: 'https://evil.example/x',
            trusted: false,
            authOnly: false,
        });
    });

    it.each([
        'javascript:alert(1)',
        'mailto:a@b.c',
        'tel:123',
        'data:text/html,<b>x</b>',
        'intent://scan/#Intent;scheme=zxing;end',
        'file:///etc/passwd',
        'hikka://anime/x',
        '',
    ])('ignores %j', (href) => {
        expect(resolveLink(href).kind).not.toBe('external');
    });
});

describe('image urls', () => {
    it('allows https and resolves relative paths against the site', () => {
        expect(resolveImageUrl('https://cdn.hikka.io/a.jpg')).toBe(
            'https://cdn.hikka.io/a.jpg',
        );
        expect(resolveImageUrl('/uploads/a.jpg')).toBe(
            'https://hikka.io/uploads/a.jpg',
        );
        expect(resolveImageUrl('//cdn.example/a.jpg')).toBe(
            'https://cdn.example/a.jpg',
        );
    });

    it.each([
        'http://example.com/a.jpg',
        'data:image/png;base64,AAAA',
        'file:///private/var/a.png',
        'content://media/a',
        'javascript:alert(1)',
        '',
    ])('drops %j', (href) => {
        expect(resolveImageUrl(href)).toBeNull();
    });
});
