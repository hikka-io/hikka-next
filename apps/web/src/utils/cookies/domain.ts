// Cookie domain: runtime COOKIE_DOMAIN on the server, VITE_COOKIE_DOMAIN in the
// browser. Non-VITE_ vars aren't on import.meta.env, so read via process.env.
export function getCookieDomain(): string | undefined {
    if (import.meta.env.SSR && process.env.COOKIE_DOMAIN) {
        return process.env.COOKIE_DOMAIN;
    }

    return import.meta.env.VITE_COOKIE_DOMAIN;
}

/** Cookies are insecure only in local dev (`localhost`); HTTPS everywhere else. */
export function isSecureCookieDomain(domain: string | undefined): boolean {
    return !!domain && domain !== 'localhost';
}
