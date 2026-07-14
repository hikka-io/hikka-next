/** First IP from an `x-forwarded-for` chain (the real user), if present. */
export function firstForwardedIp(
    forwarded: string | null | undefined,
): string | undefined {
    return forwarded?.split(',')[0]?.trim() || undefined;
}
