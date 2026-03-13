import { HikkaClient } from '@hikka/client';

export function makeCookieHeader(
    name: string,
    value: string,
    options?: { maxAge?: number; httpOnly?: boolean },
): string {
    const domain = process.env.COOKIE_DOMAIN;
    const secure = domain && domain !== 'localhost';
    const maxAge = options?.maxAge ?? 60 * 60 * 24 * 30; // default 30 days
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

export function clearCookieHeader(name: string, domain?: string): string {
    const secure = domain && domain !== 'localhost';
    return [
        `${name}=`,
        'Max-Age=0',
        'Path=/',
        domain ? `Domain=${domain}` : '',
        'HttpOnly',
        secure ? 'Secure' : '',
        'SameSite=Lax',
    ]
        .filter(Boolean)
        .join('; ');
}

export function createServerHikkaClient(): HikkaClient {
    return new HikkaClient({
        baseUrl: process.env.API_URL ?? 'https://api.hikka.io',
    });
}
