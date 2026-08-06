import { describe, expect, it } from 'vitest';

import { isNavActive } from './navigation';

// The nested /edit entries are the only pair where a prefix match is wrong, so
// pin the "deepest item wins" rule against a future nested route.
describe('isNavActive', () => {
    it('marks an item active on its own page', () => {
        expect(isNavActive('/anime', '/anime')).toBe(true);
        expect(isNavActive('/edit', '/edit')).toBe(true);
        expect(isNavActive('/edit/content', '/edit/content')).toBe(true);
    });

    it('marks a root active for pages nested under it', () => {
        expect(isNavActive('/anime/frieren-ad4e3e', '/anime')).toBe(true);
        expect(isNavActive('/edit/428923', '/edit')).toBe(true);
    });

    it('leaves the shallower item inactive when a deeper one claims the page', () => {
        expect(isNavActive('/edit/content', '/edit')).toBe(false);
    });

    it('keeps the deeper item active for its own nested pages', () => {
        expect(isNavActive('/edit/content/anything', '/edit/content')).toBe(
            true,
        );
        expect(isNavActive('/edit/content/anything', '/edit')).toBe(false);
    });

    it('does not match on a shared path segment prefix', () => {
        expect(isNavActive('/editorial', '/edit')).toBe(false);
        expect(isNavActive('/edit/contents', '/edit/content')).toBe(false);
    });

    it('matches home only exactly', () => {
        expect(isNavActive('/', '/')).toBe(true);
        expect(isNavActive('/anime', '/')).toBe(false);
    });
});
