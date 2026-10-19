import { describe, expect, it } from 'vitest';

import { validateRedirectUrl } from './url';

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
