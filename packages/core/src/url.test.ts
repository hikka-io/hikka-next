import { describe, expect, it } from 'vitest';

import { resolveHttpsUrl, resolveSameOriginUrl, resolveWebUrl } from './url';

const SITE_URL = 'https://hikka.io';

describe('resolveWebUrl', () => {
    it('accepts http(s) and relative links', () => {
        expect(resolveWebUrl('https://x.io/a', SITE_URL)?.href).toBe(
            'https://x.io/a',
        );
        expect(resolveWebUrl(' http://x.io ', SITE_URL)?.protocol).toBe(
            'http:',
        );
        expect(resolveWebUrl('/anime/a', SITE_URL)?.href).toBe(
            'https://hikka.io/anime/a',
        );
    });

    it('rejects other schemes and empty values', () => {
        expect(resolveWebUrl('javascript:alert(1)', SITE_URL)).toBeNull();
        expect(resolveWebUrl('data:text/html,x', SITE_URL)).toBeNull();
        expect(resolveWebUrl('intent://x', SITE_URL)).toBeNull();
        expect(resolveWebUrl('  ', SITE_URL)).toBeNull();
    });
});

describe('resolveHttpsUrl', () => {
    it('keeps https only', () => {
        expect(resolveHttpsUrl('http://x.io/a.jpg', SITE_URL)).toBeNull();
        expect(resolveHttpsUrl('/a.jpg', SITE_URL)?.href).toBe(
            'https://hikka.io/a.jpg',
        );
    });
});

describe('resolveSameOriginUrl', () => {
    it('resolves a relative path against the base', () => {
        expect(resolveSameOriginUrl('/anime?page=2', SITE_URL)?.href).toBe(
            'https://hikka.io/anime?page=2',
        );
        expect(resolveSameOriginUrl('/', SITE_URL)?.href).toBe(
            'https://hikka.io/',
        );
    });

    it('keeps an absolute same-origin URL', () => {
        expect(
            resolveSameOriginUrl('https://hikka.io/u/someone#top', SITE_URL)
                ?.href,
        ).toBe('https://hikka.io/u/someone#top');
    });

    it('returns a URL object', () => {
        expect(resolveSameOriginUrl('/anime', SITE_URL)).toBeInstanceOf(URL);
    });

    it.each([
        'https://evil.example/anime',
        '//evil.example/anime',
        'http://hikka.io/anime',
        'https://hikka.io:8443/anime',
        'javascript:alert(1)',
        '/\\evil.example/anime',
        'https://hikka.io@evil.example',
    ])('rejects the cross-origin target %s', (target) => {
        expect(resolveSameOriginUrl(target, SITE_URL)).toBeNull();
    });

    it.each(['http://[', 'https://hikka.io:99999/'])(
        'rejects the malformed target %s',
        (target) => {
            expect(() => resolveSameOriginUrl(target, SITE_URL)).not.toThrow();
            expect(resolveSameOriginUrl(target, SITE_URL)).toBeNull();
        },
    );

    it('rejects everything when the base is malformed', () => {
        expect(resolveSameOriginUrl('/anime', '')).toBeNull();
        expect(resolveSameOriginUrl('/anime', 'not a url')).toBeNull();
    });
});
