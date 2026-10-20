import type { QueryClient, QueryObserverOptions } from '@tanstack/react-query';

import type { QueryId } from '@hikka/core';

type Tier = {
    ids: readonly QueryId[];
    options: Pick<
        QueryObserverOptions,
        'staleTime' | 'refetchOnWindowFocus' | 'refetchInterval'
    >;
};

const NOTIFICATION_COUNT_STALE_MS = 30_000;
export const NOTIFICATION_COUNT_POLL_MS = 60_000;

/**
 * Per-key policy, like the web's `QUERY_DEFAULT_TIERS`. Lookups change with a release, not a
 * session. The unseen count refetches on return to the app and polls every minute while the app
 * is active: `focusManager` follows `AppState`, and an interval does not run while unfocused.
 */
export const QUERY_DEFAULT_TIERS = [
    {
        ids: ['genres', 'searchCompanies'],
        options: { staleTime: Number.POSITIVE_INFINITY },
    },
    {
        ids: ['unseenNotificationsCount'],
        options: {
            staleTime: NOTIFICATION_COUNT_STALE_MS,
            refetchOnWindowFocus: true,
            refetchInterval: NOTIFICATION_COUNT_POLL_MS,
        },
    },
] as const satisfies readonly Tier[];

// Generated keys are `[{ _id, … }]`; `setQueryDefaults` matches `[{ _id }]` against them partially.
export function applyQueryDefaults(queryClient: QueryClient): void {
    for (const { ids, options } of QUERY_DEFAULT_TIERS) {
        for (const id of ids) {
            queryClient.setQueryDefaults([{ _id: id }], options);
        }
    }
}
