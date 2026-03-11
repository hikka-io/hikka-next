import { HikkaClient } from '@hikka/client';

export function makeCookieHeader(name: string, value: string): string {
    const domain = process.env.COOKIE_DOMAIN;
    const httpOnly = process.env.COOKIE_HTTP_ONLY === 'true';
    const secure = domain && domain !== 'localhost';
    const maxAge = 60 * 60 * 24 * 30; // 30 days
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
