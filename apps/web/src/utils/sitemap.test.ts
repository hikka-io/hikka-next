import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Client } from '@hikka/api';

vi.mock('./api/server-client', () => ({ createServerHikkaClient: vi.fn() }));
vi.mock('./url', () => ({ getSiteUrl: () => 'https://hikka.io' }));

const HOUR = 60 * 60 * 1000;

const ENTRIES = [{ slug: 'frieren', updated_at: 1 }];

function fakeClient(get: ReturnType<typeof vi.fn>) {
    return { get } as unknown as Client;
}

async function load() {
    vi.resetModules();
    return import('./sitemap');
}

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

describe('fetchSitemapEntries', () => {
    it('serves repeat calls for a type from memory within the hour', async () => {
        const { fetchSitemapEntries } = await load();
        const get = vi.fn(async () => ({ data: ENTRIES }));

        const first = await fetchSitemapEntries(fakeClient(get), 'anime');
        vi.advanceTimersByTime(HOUR - 1);
        const second = await fetchSitemapEntries(fakeClient(get), 'anime');

        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith({
            url: '/sitemap/sitemap_anime.json',
            throwOnError: true,
        });
        expect(first).toBe(ENTRIES);
        expect(second).toBe(ENTRIES);
    });

    it('refetches once the hour has passed', async () => {
        const { fetchSitemapEntries } = await load();
        const get = vi.fn(async () => ({ data: ENTRIES }));

        await fetchSitemapEntries(fakeClient(get), 'anime');
        vi.advanceTimersByTime(HOUR);
        await fetchSitemapEntries(fakeClient(get), 'anime');

        expect(get).toHaveBeenCalledTimes(2);
    });

    it('keeps each content type separate', async () => {
        const { fetchSitemapEntries } = await load();
        const get = vi.fn(async () => ({ data: ENTRIES }));

        await fetchSitemapEntries(fakeClient(get), 'anime');
        await fetchSitemapEntries(fakeClient(get), 'manga');

        expect(get).toHaveBeenCalledTimes(2);
    });

    it('shares one in-flight request between concurrent callers', async () => {
        const { fetchSitemapEntries } = await load();
        let resolve: (value: { data: typeof ENTRIES }) => void = () => {};
        const get = vi.fn(
            () =>
                new Promise<{ data: typeof ENTRIES }>((r) => {
                    resolve = r;
                }),
        );

        const a = fetchSitemapEntries(fakeClient(get), 'novel');
        const b = fetchSitemapEntries(fakeClient(get), 'novel');
        resolve({ data: ENTRIES });

        expect(await a).toBe(ENTRIES);
        expect(await b).toBe(ENTRIES);
        expect(get).toHaveBeenCalledTimes(1);
    });

    it('never keeps a failed fetch', async () => {
        const { fetchSitemapEntries } = await load();
        const get = vi
            .fn()
            .mockRejectedValueOnce(new Error('boom'))
            .mockResolvedValueOnce({ data: ENTRIES });

        await expect(
            fetchSitemapEntries(fakeClient(get), 'anime'),
        ).rejects.toThrow('boom');
        await expect(
            fetchSitemapEntries(fakeClient(get), 'anime'),
        ).resolves.toBe(ENTRIES);

        expect(get).toHaveBeenCalledTimes(2);
    });
});
