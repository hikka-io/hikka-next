import { HikkaClient } from '@hikka/client';
import { infiniteQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import { UseFeedParams } from '@/types/feed';

export function feedOptions(
    client: HikkaClient,
    { args }: UseFeedParams = {},
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.feed.list(args),
        queryFn: ({ pageParam }) =>
            client.feed.getFeed({
                ...args,
                before: pageParam,
            }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (lastPage.length === 0) return undefined;

            const lastItem = lastPage[lastPage.length - 1];

            return new Date(lastItem.created * 1000).toISOString();
        },
    });
}
