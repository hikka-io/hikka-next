import { createServerFn } from '@tanstack/react-start';

// Server function for isomorphic use (works from both server and client via RPC)
export const getAuthTokenFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getRequest } = await import('@tanstack/react-start/server');
        const request = getRequest();
        if (!request) return null;
        const cookieHeader = request.headers.get('cookie') ?? '';
        const match = cookieHeader.match(/(?:^|;\s*)auth=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
    },
);

// Client-side cookie helpers (for use in browser components)
export async function setCookie(name: string, value: string): Promise<void> {
    const maxAge = 60 * 60 * 24 * 30; // 30 days
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

export async function deleteCookie(name: string): Promise<void> {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}
