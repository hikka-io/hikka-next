import { cacheControlHeadersFor, shouldNoCache } from './cache-control';
import { DEFAULT_CACHE_CONTROL } from './config';

describe('shouldNoCache', () => {
    it('matches wildcard noCache patterns', () => {
        expect(shouldNoCache('/watch/some-slug', DEFAULT_CACHE_CONTROL)).toBe(
            true,
        );
        expect(shouldNoCache('/notifications', DEFAULT_CACHE_CONTROL)).toBe(
            true,
        );
    });
    it('returns false for cacheable paths', () => {
        expect(shouldNoCache('/anime/naruto', DEFAULT_CACHE_CONTROL)).toBe(
            false,
        );
    });
});

describe('cacheControlHeadersFor', () => {
    it('emits no-store headers for noCache paths', () => {
        expect(
            cacheControlHeadersFor('/notifications', DEFAULT_CACHE_CONTROL),
        ).toMatchObject({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        });
    });
    it('emits path-specific max-age', () => {
        expect(
            cacheControlHeadersFor('/anime/naruto', DEFAULT_CACHE_CONTROL),
        ).toEqual({ 'Cache-Control': 'max-age=3600' });
    });
    it('falls back to default max-age', () => {
        expect(
            cacheControlHeadersFor('/some/other', DEFAULT_CACHE_CONTROL),
        ).toEqual({ 'Cache-Control': 'max-age=300' });
    });
});
