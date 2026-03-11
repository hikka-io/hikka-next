export function parseAuthCookie(cookieString: string): string | null {
    const match = cookieString.match(/(?:^|;\s*)auth=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}
