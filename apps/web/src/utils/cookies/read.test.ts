import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { configureBrowserClient, setAuthToken } from '@hikka/api';

import { readAuthToken, readNsfwConsent } from './read';

const server = vi.hoisted(() => ({
    getAuthTokenFn: vi.fn(async () => 'server-token' as string | null),
    getNsfwConsentFn: vi.fn(async () => '1' as string | null),
}));

vi.mock('./server', () => server);

const setDocumentCookie = (value: string) =>
    vi.spyOn(document, 'cookie', 'get').mockReturnValue(value);

const BASE_URL = 'https://api.example.test';

beforeEach(() => {
    configureBrowserClient({ baseUrl: BASE_URL });
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.clearAllMocks();
});

describe('readAuthToken', () => {
    it('reads the in-memory browser token without a server round trip', async () => {
        setAuthToken('memory-token');

        await expect(readAuthToken()).resolves.toBe('memory-token');
        expect(server.getAuthTokenFn).not.toHaveBeenCalled();
    });

    it('returns null in the browser when no token was seeded', async () => {
        setAuthToken(undefined);

        await expect(readAuthToken()).resolves.toBeNull();
        expect(server.getAuthTokenFn).not.toHaveBeenCalled();
    });

    it('follows a token set after startup, as after login', async () => {
        await expect(readAuthToken()).resolves.toBeNull();

        setAuthToken('fresh-secret');

        await expect(readAuthToken()).resolves.toBe('fresh-secret');
    });

    it('sees the token the router seeds at startup', async () => {
        configureBrowserClient({
            baseUrl: BASE_URL,
            authToken: 'seeded-token',
        });

        await expect(readAuthToken()).resolves.toBe('seeded-token');
        expect(server.getAuthTokenFn).not.toHaveBeenCalled();
    });

    it('reads the request cookie in process on the server', async () => {
        vi.stubGlobal('window', undefined);
        setAuthToken('memory-token');

        await expect(readAuthToken()).resolves.toBe('server-token');
        expect(server.getAuthTokenFn).toHaveBeenCalledTimes(1);
    });

    it('returns null on the server when the cookie is absent', async () => {
        vi.stubGlobal('window', undefined);
        server.getAuthTokenFn.mockResolvedValueOnce(null);

        await expect(readAuthToken()).resolves.toBeNull();
    });
});

describe('readNsfwConsent', () => {
    it('reads the cookie from the document in the browser', async () => {
        setDocumentCookie('theme=dark; nsfw_confirmed=1');

        await expect(readNsfwConsent()).resolves.toBe('1');
        expect(server.getNsfwConsentFn).not.toHaveBeenCalled();
    });

    it('returns null in the browser without the cookie', async () => {
        setDocumentCookie('other=1');

        await expect(readNsfwConsent()).resolves.toBeNull();
        expect(server.getNsfwConsentFn).not.toHaveBeenCalled();
    });

    it('does not match a cookie that merely ends with the name', async () => {
        setDocumentCookie('x_nsfw_confirmed=1');

        await expect(readNsfwConsent()).resolves.toBeNull();
    });

    it('uses the server function on the server', async () => {
        vi.stubGlobal('window', undefined);

        await expect(readNsfwConsent()).resolves.toBe('1');
        expect(server.getNsfwConsentFn).toHaveBeenCalledTimes(1);
    });
});
