import { ignoredNotificationsOptions } from '@/options/api/settings';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';

/**
 * Function for prefetching ignored notification types
 */
export async function prefetchIgnoredNotifications({
    ...rest
}: PrefetchQueryParams = {}) {
    return prefetchQuery({
        optionsFactory: (client) => ignoredNotificationsOptions(client),
        ...rest,
    });
}
