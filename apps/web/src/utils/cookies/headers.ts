import { type Client, createRequestClient } from '@hikka/api';

import { getInternalApiUrl, PUBLIC_API_URL } from '@/utils/api/base-url';

import { getCookieDomain, isSecureCookieDomain } from './domain';

// 30 days. The API extends the auth token on each authenticated request,
// so the cookie should comfortably outlive any single token.
const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function makeCookieHeader(
    name: string,
    value: string,
    options?: { maxAge?: number; httpOnly?: boolean },
): string {
    const domain = getCookieDomain();
    const secure = isSecureCookieDomain(domain);
    const maxAge = options?.maxAge ?? DEFAULT_COOKIE_MAX_AGE;
    const httpOnly = options?.httpOnly ?? true;
    return [
        `${name}=${encodeURIComponent(value)}`,
        `Max-Age=${maxAge}`,
        'Path=/',
        domain ? `Domain=${domain}` : '',
        httpOnly ? 'HttpOnly' : '',
        secure ? 'Secure' : '',
        'SameSite=Lax',
    ]
        .filter(Boolean)
        .join('; ');
}

export function clearCookieHeader(
    name: string,
    domain?: string,
    options?: { httpOnly?: boolean },
): string {
    const secure = isSecureCookieDomain(domain);
    const httpOnly = options?.httpOnly ?? true;
    return [
        `${name}=`,
        'Max-Age=0',
        'Path=/',
        domain ? `Domain=${domain}` : '',
        httpOnly ? 'HttpOnly' : '',
        secure ? 'Secure' : '',
        'SameSite=Lax',
    ]
        .filter(Boolean)
        .join('; ');
}

export function createServerHikkaClient(): Client {
    return createRequestClient({
        baseUrl: PUBLIC_API_URL,
        internalBaseUrl: getInternalApiUrl(),
    });
}
