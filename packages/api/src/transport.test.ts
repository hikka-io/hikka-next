import { HikkaApiError } from './errors';
import { createRequestClient } from './transport';

describe('createRequestClient', () => {
    const realFetch = globalThis.fetch;
    afterEach(() => {
        globalThis.fetch = realFetch;
    });

    it('adds the auth header and maps non-ok responses to HikkaApiError', async () => {
        let seenAuth: string | null = null;
        globalThis.fetch = (async (input: Request) => {
            seenAuth = input.headers.get('auth');
            return new Response(
                JSON.stringify({ message: 'nope', code: 'forbidden' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }) as typeof fetch;

        const client = createRequestClient({ authToken: 'tok123' });

        await expect(
            client.get({
                url: '/characters/{slug}',
                path: { slug: 'x' },
                throwOnError: true,
            }),
        ).rejects.toBeInstanceOf(HikkaApiError);
        expect(seenAuth).toBe('tok123');
    });
});
