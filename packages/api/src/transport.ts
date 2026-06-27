import { DEFAULT_BASE_URL } from './config';
import { HikkaApiError } from './errors';
import { type Client, createClient, createConfig } from './gen/client';
import { client } from './gen/client.gen';

export interface TransportOptions {
    baseUrl?: string;
    authToken?: string;
}

/**
 * Wires the auth header and HikkaApiError mapping onto a client instance.
 * `getAuthToken` is read per-request so the browser singleton can update its
 * token without re-registering interceptors.
 */
function attachInterceptors(
    target: Client,
    getAuthToken: () => string | undefined,
): void {
    target.interceptors.request.use((request) => {
        const token = getAuthToken();
        if (token) request.headers.set('auth', token);
        return request;
    });

    target.interceptors.error.use((error, response) => {
        const body =
            error && typeof error === 'object'
                ? (error as { message?: string; code?: string })
                : null;
        return new HikkaApiError(
            body?.message ??
                (response
                    ? `API request failed with status ${response.status}`
                    : 'Network request failed'),
            response?.status ?? 0,
            body?.code ?? 'unknown_error',
            body ?? error,
        );
    });
}

let browserToken: string | undefined;
let browserConfigured = false;

/** Configure the singleton browser client. Call once at app startup. */
export function configureBrowserClient(opts: TransportOptions = {}): void {
    browserToken = opts.authToken;
    client.setConfig({
        baseUrl: opts.baseUrl ?? DEFAULT_BASE_URL,
        credentials: 'include',
    });
    if (!browserConfigured) {
        attachInterceptors(client, () => browserToken);
        browserConfigured = true;
    }
}

/** Update the browser singleton's auth token (login/logout). */
export function setAuthToken(token: string | undefined): void {
    browserToken = token;
}

/**
 * The configured browser singleton client. Its interceptor reads the auth
 * token live, so it always reflects the latest `setAuthToken` value — use it
 * as the router-context client in the browser (never on the server, where a
 * shared client would leak tokens across concurrent requests).
 */
export function getBrowserClient(): Client {
    return client;
}

/** Current browser auth token, if any (used to gate authenticated queries). */
export function getAuthToken(): string | undefined {
    return browserToken;
}

/**
 * Build an isolated per-request client for SSR. Each request gets its own
 * client carrying that request's auth token, so tokens never leak between
 * concurrent server requests.
 */
export function createRequestClient(opts: TransportOptions = {}): Client {
    const requestClient = createClient(
        createConfig({
            baseUrl: opts.baseUrl ?? DEFAULT_BASE_URL,
            credentials: 'include',
        }),
    );
    attachInterceptors(requestClient, () => opts.authToken);
    return requestClient;
}
