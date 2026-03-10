import { getRequest } from '@tanstack/react-start/server';

export async function getCookie(name: string): Promise<string | undefined> {
    const request = getRequest();
    if (!request) return undefined;
    const cookieHeader = request.headers.get('cookie') ?? '';
    const match = cookieHeader.match(
        new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
    );
    return match ? decodeURIComponent(match[1]) : undefined;
}

export async function getCookies(): Promise<Array<{ name: string; value: string }>> {
    const request = getRequest();
    if (!request) return [];
    const cookieHeader = request.headers.get('cookie') ?? '';
    return cookieHeader
        .split(';')
        .map((pair: string) => {
            const [cookieName, ...rest] = pair.trim().split('=');
            return { name: cookieName.trim(), value: decodeURIComponent(rest.join('=')) };
        })
        .filter((c: { name: string; value: string }) => c.name);
}

export async function setCookie(_name: string, _value: string): Promise<void> {
    // Cookie setting in server context happens via Response headers in API routes
    // This is a no-op placeholder for compatibility
}

export async function deleteCookie(_name: string): Promise<void> {
    // Cookie deletion in server context happens via Response headers in API routes
    // This is a no-op placeholder for compatibility
}
