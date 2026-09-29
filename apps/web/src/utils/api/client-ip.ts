import { createServerFn } from '@tanstack/react-start';

/** First IP from an `x-forwarded-for` chain (the real user), if present. */
export function firstForwardedIp(
    forwarded: string | null | undefined,
): string | undefined {
    return forwarded?.split(',')[0]?.trim() || undefined;
}

export const getClientIpFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getRequestHeader } = await import(
            '@tanstack/react-start/server'
        );
        return firstForwardedIp(getRequestHeader('x-forwarded-for')) ?? null;
    },
);
