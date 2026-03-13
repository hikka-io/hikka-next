import { createServerFn } from '@tanstack/react-start';

// Server function for isomorphic use (works from both server and client via RPC)
export const getAuthTokenFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getCookie } = await import('@tanstack/react-start/server');
        return getCookie('auth') ?? null;
    },
);
