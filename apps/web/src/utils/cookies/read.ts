import { getAuthToken } from '@hikka/api';

import { isServer } from '@/utils/is-server';

import { COOKIE } from './constants';
import { getAuthTokenFn, getNsfwConsentFn } from './server';

function readDocumentCookie(name: string): string | null {
    const prefix = `${name}=`;
    const entry = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(prefix));

    return entry ? entry.slice(prefix.length) : null;
}

/** The auth cookie is HttpOnly: the browser singleton is seeded at startup and on login. */
export async function readAuthToken(): Promise<string | null> {
    if (isServer()) return getAuthTokenFn();

    return getAuthToken() ?? null;
}

export async function readNsfwConsent(): Promise<string | null> {
    if (isServer()) return getNsfwConsentFn();

    return readDocumentCookie(COOKIE.nsfwConsent.name);
}
