const DAY = 60 * 60 * 24;

type CookieSpec = {
    name: string;
    maxAge?: number;
    scope: 'host' | 'domain';
};

export const COOKIE = {
    // The API extends the auth token on each authenticated request,
    // so the cookie should comfortably outlive any single token.
    auth: { name: 'auth', maxAge: 30 * DAY, scope: 'domain' },
    theme: { name: 'theme', maxAge: 365 * DAY, scope: 'host' },
    uiPrefs: { name: 'ui-prefs', maxAge: 365 * DAY, scope: 'host' },
    nsfwConsent: { name: 'nsfw_confirmed', maxAge: 7 * DAY, scope: 'domain' },
    legacyUsername: { name: 'username', scope: 'domain' },
} as const satisfies Record<string, CookieSpec>;

export type HostCookie = Extract<
    (typeof COOKIE)[keyof typeof COOKIE],
    { scope: 'host' }
>;
