import { describe, expect, it } from 'vitest';

import { COOKIE } from './constants';

describe('COOKIE', () => {
    it('keeps every cookie name, lifetime and scope byte-identical', () => {
        expect(COOKIE).toStrictEqual({
            auth: { name: 'auth', maxAge: 2592000, scope: 'domain' },
            theme: { name: 'theme', maxAge: 31536000, scope: 'host' },
            uiPrefs: { name: 'ui-prefs', maxAge: 31536000, scope: 'host' },
            nsfwConsent: {
                name: 'nsfw_confirmed',
                maxAge: 604800,
                scope: 'domain',
            },
            legacyUsername: { name: 'username', scope: 'domain' },
        });
    });
});
