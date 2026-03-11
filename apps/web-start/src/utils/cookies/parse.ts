export function parseAuthCookie(cookieString: string): string | null {
    const match = cookieString.match(/(?:^|;\s*)auth=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export function parseCookies(cookieHeader: string): Record<string, string> {
    return Object.fromEntries(
        cookieHeader
            .split(';')
            .map((c) => {
                const [key, ...vals] = c.trim().split('=');
                return [key, decodeURIComponent(vals.join('='))];
            })
            .filter(([key]) => key),
    );
}
