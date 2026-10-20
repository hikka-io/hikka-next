import { describe, expect, it } from 'vitest';

import { getPlatformIcon } from './platform-icons';

describe('getPlatformIcon', () => {
    it('matches a host and its subdomains', () => {
        expect(getPlatformIcon('https://www.crunchyroll.com/series/x')).toBe(
            '/icons/platforms/crunchyroll.png',
        );
        expect(getPlatformIcon('https://ja.wikipedia.org/wiki/x')).toBe(
            '/icons/platforms/wikipedia.png',
        );
    });

    it('returns null for unknown hosts and invalid urls', () => {
        expect(getPlatformIcon('https://example.com')).toBeNull();
        expect(getPlatformIcon('not a url')).toBeNull();
    });
});
