import { createServerFn } from '@tanstack/react-start';

import { parseAuthCookie } from './parse';

// Server function for isomorphic use (works from both server and client via RPC)
export const getAuthTokenFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getRequest } = await import('@tanstack/react-start/server');
        const request = getRequest();
        if (!request) return null;
        const cookieHeader = request.headers.get('cookie') ?? '';
        return parseAuthCookie(cookieHeader);
    },
);

// Client-side cookie helpers (for use in browser components)
export async function setCookie(name: string, value: string): Promise<void> {
    const maxAge = 60 * 60 * 24 * 30; // 30 days
    const domain = import.meta.env.VITE_COOKIE_DOMAIN;
    const parts = [
        `${name}=${encodeURIComponent(value)}`,
        `Max-Age=${maxAge}`,
        'Path=/',
        'SameSite=Lax',
    ];
    if (domain) parts.push(`Domain=${domain}`);
    if (domain && domain !== 'localhost') parts.push('Secure');
    document.cookie = parts.join('; ');
}

export async function deleteCookie(name: string): Promise<void> {
    const domain = import.meta.env.VITE_COOKIE_DOMAIN;
    const parts = [`${name}=`, 'Max-Age=0', 'Path=/', 'SameSite=Lax'];
    if (domain) parts.push(`Domain=${domain}`);
    if (domain && domain !== 'localhost') parts.push('Secure');
    document.cookie = parts.join('; ');
}
