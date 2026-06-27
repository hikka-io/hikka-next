import { infiniteQueryOptions } from '@tanstack/react-query';

import { type FeedArgs, type GetFeedResponse, getFeed } from '@hikka/api';

type GetFeedClient = Pick<Parameters<typeof getFeed>[0], 'client'>;

/**
 * Cursor-based infinite options for the `/feed` endpoint.
 *
 * The generated `getFeed` operation is a POST that returns a flat array with
 * no `{ list, pagination }` envelope, so it has no generated `*InfiniteOptions`
 * and cannot use the shared `useInfiniteList` helper. This mirrors the old
 * `the legacy react package` `feedOptions`: it pages with the `before` cursor (ISO date of
 * the last item's `created`) carried in the request body.
 */
export function feedInfiniteOptions(
    args: FeedArgs = {},
    options?: GetFeedClient,
) {
    return infiniteQueryOptions({
        queryKey: ['feed', { body: args }] as const,
        queryFn: async ({ pageParam, signal }) => {
            const { data } = await getFeed({
                ...options,
                body: { ...args, before: pageParam },
                signal,
                throwOnError: true,
            });
            return data;
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage: GetFeedResponse) => {
            if (lastPage.length === 0) return undefined;
            const lastItem = lastPage[lastPage.length - 1];
            return new Date(lastItem.created * 1000).toISOString();
        },
    });
}
