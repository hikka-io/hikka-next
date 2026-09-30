import { describe, expect, it } from 'vitest';

import { resolveSameOriginUrl, validateRedirectUrl } from './url';

const SITE_URL = 'https://hikka.io';

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

    it.each([
        'http://[',
        'https://hikka.io:99999/',
    ])('rejects the malformed target %s', (target) => {
        expect(() => resolveSameOriginUrl(target, SITE_URL)).not.toThrow();
        expect(resolveSameOriginUrl(target, SITE_URL)).toBeNull();
    });

    it('rejects everything when the base is malformed', () => {
        expect(resolveSameOriginUrl('/anime', '')).toBeNull();
        expect(resolveSameOriginUrl('/anime', 'not a url')).toBeNull();
    });
});

describe('validateRedirectUrl', () => {
    const origin = window.location.origin;

    it('keeps the path and search of a same-origin target', () => {
        expect(validateRedirectUrl('/anime?page=2')).toBe('/anime?page=2');
        expect(validateRedirectUrl(`${origin}/u/someone?tab=1#top`)).toBe(
            '/u/someone?tab=1',
        );
        expect(validateRedirectUrl('anime')).toBe('/anime');
    });

    it.each([
        'https://evil.example/anime',
        '//evil.example/anime',
        'javascript:alert(1)',
        'http://[',
    ])('falls back to the home page for %s', (target) => {
        expect(validateRedirectUrl(target)).toBe('/');
    });
});
