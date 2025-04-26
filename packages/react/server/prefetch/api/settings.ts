import { IgnoredNotificationsResponse } from '@hikka/client';

import { queryKeys } from '@/core';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import { UseIgnoredNotificationsParams } from '@/types/settings';

/**
 * Function for prefetching ignored notification types
 */
export async function prefetchIgnoredNotifications({
    ...rest
}: PrefetchQueryParams<IgnoredNotificationsResponse> &
    UseIgnoredNotificationsParams = {}) {
    return prefetchQuery({
        queryKey: queryKeys.settings.ignoredNotifications(),
        queryFn: (client) => client.settings.getIgnoredNotifications(),
        ...rest,
    });
}
