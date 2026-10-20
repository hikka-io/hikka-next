import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import {
    byContent,
    bySlug,
    byUsername,
    refreshQueries,
} from './use-pull-to-refresh';

const observe = (client: QueryClient, key: unknown[]) => {
    const queryFn = vi.fn(async () => 'data');
    const observer = new QueryObserver(client, { queryKey: key, queryFn });
    const unsubscribe = observer.subscribe(() => {});
    return { queryFn, unsubscribe };
};

const settle = (client: QueryClient) =>
    vi.waitFor(() =>
        expect(
            client
                .getQueryCache()
                .getAll()
                .every((query) => query.state.status === 'success'),
        ).toBe(true),
    );

describe('refreshQueries', () => {
    it('refetches mounted queries whose path slug matches and stale-marks the rest', async () => {
        const client = new QueryClient();
        const info = observe(client, [
            { _id: 'animeSlug', path: { slug: 'a' } },
        ]);
        const franchise = observe(client, [
            {
                _id: 'contentFranchise',
                path: { slug: 'a', content_type: 'anime' },
            },
        ]);
        const other = observe(client, [
            { _id: 'animeSlug', path: { slug: 'b' } },
        ]);
        const profile = observe(client, [{ _id: 'profile' }]);
        await settle(client);
        franchise.unsubscribe();

        await refreshQueries(client, bySlug('a'));

        expect(info.queryFn).toHaveBeenCalledTimes(2);
        expect(franchise.queryFn).toHaveBeenCalledTimes(1);
        expect(
            client.getQueryCache().find({
                queryKey: [
                    {
                        _id: 'contentFranchise',
                        path: { slug: 'a', content_type: 'anime' },
                    },
                ],
            })?.state.isInvalidated,
        ).toBe(true);
        expect(other.queryFn).toHaveBeenCalledTimes(1);
        expect(profile.queryFn).toHaveBeenCalledTimes(1);

        for (const query of [info, other, profile]) {
            query.unsubscribe();
        }
        client.clear();
    });

    it('matches profile queries by username in any case', async () => {
        const client = new QueryClient();
        const stats = observe(client, [
            { _id: 'userWatchStats', path: { username: 'Olexh' } },
        ]);
        const other = observe(client, [
            { _id: 'userWatchStats', path: { username: 'someone' } },
        ]);
        await settle(client);

        await refreshQueries(client, byUsername(['olexh']));

        expect(stats.queryFn).toHaveBeenCalledTimes(2);
        expect(other.queryFn).toHaveBeenCalledTimes(1);

        stats.unsubscribe();
        other.unsubscribe();
        client.clear();
    });

    it('matches a title page plus the lists filtered by it in the body', () => {
        const matches = byContent('a');
        const query = (key: Record<string, unknown>) =>
            ({ queryKey: [key] }) as unknown as Parameters<typeof matches>[0];

        expect(matches(query({ path: { slug: 'a' } }))).toBe(true);
        expect(matches(query({ body: { content: ['a'] } }))).toBe(true);
        expect(matches(query({ body: { content_slug: 'a' } }))).toBe(true);
        expect(matches(query({ body: { content: ['b'] } }))).toBe(false);
        expect(matches(query({ body: { content_slug: 'b' } }))).toBe(false);
        expect(matches(query({ path: { slug: 'b' } }))).toBe(false);
    });
});
