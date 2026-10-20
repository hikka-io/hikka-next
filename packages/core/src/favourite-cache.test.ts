import { QueryClient } from '@tanstack/query-core';
import { describe, expect, it } from 'vitest';

import {
    FavouriteContentTypeEnum,
    favouriteListQueryKey,
    getFavouriteQueryKey,
    getVoteQueryKey,
} from '@hikka/api';

import {
    applyFavouriteDeletion,
    applyFavouriteMutation,
} from './favourite-cache';

const path = { content_type: FavouriteContentTypeEnum.CHARACTER, slug: 'a' };
const entryKey = getFavouriteQueryKey({ path });

const setup = () => {
    const queryClient = new QueryClient();
    const list = favouriteListQueryKey({
        path: {
            username: 'user',
            content_type: FavouriteContentTypeEnum.CHARACTER,
        },
    });
    const vote = getVoteQueryKey({
        path: { content_type: 'collection', slug: 'ref' },
    });
    queryClient.setQueryData(list, { list: [] });
    queryClient.setQueryData(vote, { score: 0 });
    queryClient.setQueryData(entryKey, null);

    const invalidated = () =>
        queryClient
            .getQueryCache()
            .getAll()
            .filter((query) => query.state.isInvalidated)
            .map((query) => query.queryKey);

    return { queryClient, list, invalidated };
};

describe('favourite cache writers', () => {
    it('stores an added favourite and refreshes only the favourite lists', async () => {
        const { queryClient, list, invalidated } = setup();
        const favourite = { reference: 'f', created: 1 };

        await applyFavouriteMutation(
            queryClient,
            path.content_type,
            path.slug,
            favourite,
        );

        expect(queryClient.getQueryData(entryKey)).toEqual(favourite);
        expect(invalidated()).toEqual([list]);
    });

    it('stores a removed favourite as null and refreshes the lists', async () => {
        const { queryClient, list, invalidated } = setup();
        queryClient.setQueryData(entryKey, { reference: 'f', created: 1 });

        await applyFavouriteDeletion(queryClient, path.content_type, path.slug);

        expect(queryClient.getQueryData(entryKey)).toBeNull();
        expect(invalidated()).toEqual([list]);
    });
});
