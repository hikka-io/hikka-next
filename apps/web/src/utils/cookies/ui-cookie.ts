import { getCookieDomain } from './domain';

/**
 * `theme` and `ui-prefs` are host-only (no `Domain`), so hikka.io and
 * dev.hikka.io keep separate preferences; only `auth` uses COOKIE_DOMAIN. The
 * browser must stay their sole writer — a second writer using `Domain` creates
 * a same-name twin that shadows this one on every SSR read.
 */

/**
 * Expire a legacy domain-scoped twin so it can't shadow the host-only cookie.
 * Private on purpose: on `localhost` a `Domain=localhost` write collapses onto
 * the host-only cookie, so this only ever runs immediately before a rewrite.
 */
function expireLegacyDomainCookie(name: string) {
    if (typeof document === 'undefined') return;

    const domain = getCookieDomain();
    if (!domain) return;

    document.cookie = `${name}=; path=/; domain=${domain}; max-age=0; SameSite=Lax`;
}

/** Host-only cookie write; drops any legacy domain-scoped twin first. */
export function writeHostCookie(name: string, value: string, maxAge: number) {
    if (typeof document === 'undefined') return;

    expireLegacyDomainCookie(name);

    const secure = window.location.protocol === 'https:';

    document.cookie =
        `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}` +
        `; SameSite=Lax${secure ? '; Secure' : ''}`;
}
