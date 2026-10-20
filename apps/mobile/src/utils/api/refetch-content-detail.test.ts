import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import { refetchContentDetail } from './refetch-content-detail';

const observe = (client: QueryClient, key: unknown[]) => {
    const queryFn = vi.fn(async () => 'data');
    const observer = new QueryObserver(client, { queryKey: key, queryFn });
    const unsubscribe = observer.subscribe(() => {});
    return { queryFn, unsubscribe };
};

describe('refetchContentDetail', () => {
    it('refetches only mounted queries whose path slug matches', async () => {
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
        await vi.waitFor(() =>
            expect(
                client
                    .getQueryCache()
                    .getAll()
                    .every((query) => query.state.status === 'success'),
            ).toBe(true),
        );

        await refetchContentDetail(client, 'a');

        expect(info.queryFn).toHaveBeenCalledTimes(2);
        expect(franchise.queryFn).toHaveBeenCalledTimes(2);
        expect(other.queryFn).toHaveBeenCalledTimes(1);
        expect(profile.queryFn).toHaveBeenCalledTimes(1);

        for (const query of [info, franchise, other, profile]) {
            query.unsubscribe();
        }
        client.clear();
    });
});
