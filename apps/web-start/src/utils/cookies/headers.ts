import { HikkaClient } from '@hikka/client';

// 30 days. The API extends the auth token on each authenticated request,
// so the cookie should comfortably outlive any single token.
const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function makeCookieHeader(
    name: string,
    value: string,
    options?: { maxAge?: number; httpOnly?: boolean },
): string {
    const domain =
        import.meta.env.VITE_COOKIE_DOMAIN ?? import.meta.env.COOKIE_DOMAIN;
    const secure = domain && domain !== 'localhost';
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
    const secure = domain && domain !== 'localhost';
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

export function createServerHikkaClient(): HikkaClient {
    return new HikkaClient({
        baseUrl: import.meta.env.API_URL ?? 'https://api.hikka.io',
    });
}

/**
 * Best-effort: fetch the current user with the given secret and append a
 * non-HttpOnly `username` cookie so the UI can read it before the first
 * authenticated request resolves. Mutates `headers` and `client`.
 *
 * Failures are swallowed — the username cookie is non-critical.
 */
export async function appendUsernameCookie(
    headers: Headers,
    client: HikkaClient,
    secret: string,
): Promise<void> {
    try {
        client.setAuthToken(secret);
        const user = await client.user.getCurrentUser();
        headers.append(
            'Set-Cookie',
            makeCookieHeader('username', user.username, { httpOnly: false }),
        );
    } catch {
        // ignore
    }
}
