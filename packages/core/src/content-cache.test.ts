import { QueryClient } from '@tanstack/query-core';
import { describe, expect, it } from 'vitest';

import {
    applyWatchDeletion,
    invalidateReadState,
    invalidateWatchState,
} from './content-cache';

const seed = (queryClient: QueryClient, ids: string[]) => {
    for (const id of ids) {
        queryClient.setQueryData([{ _id: id }], { id });
    }
};

const invalidated = (queryClient: QueryClient) =>
    queryClient
        .getQueryCache()
        .getAll()
        .filter((query) => query.state.isInvalidated)
        .map((query) => (query.queryKey[0] as { _id: string })._id)
        .sort();

describe('watch/read invalidation', () => {
    it('stale-marks the watch stats and history', async () => {
        const queryClient = new QueryClient();
        seed(queryClient, [
            'userWatchList',
            'userWatchStats',
            'userHistory',
            'searchAnime',
            'userReadStats',
        ]);

        await invalidateWatchState(queryClient);

        expect(invalidated(queryClient)).toEqual([
            'searchAnime',
            'userHistory',
            'userWatchList',
            'userWatchStats',
        ]);
    });

    it('stale-marks the read stats and history', async () => {
        const queryClient = new QueryClient();
        seed(queryClient, [
            'userReadList',
            'userReadStats',
            'userHistory',
            'searchManga',
            'userWatchStats',
        ]);

        await invalidateReadState(queryClient);

        expect(invalidated(queryClient)).toEqual([
            'searchManga',
            'userHistory',
            'userReadList',
            'userReadStats',
        ]);
    });

    it('stores null for a deleted entry', async () => {
        const queryClient = new QueryClient();
        await applyWatchDeletion(queryClient, 'frieren');

        const [entry] = queryClient
            .getQueryCache()
            .findAll()
            .filter(
                (query) =>
                    (query.queryKey[0] as { _id: string })._id === 'watchGet',
            );
        expect(entry?.state.data).toBeNull();
    });
});
