import { queryOptions } from '@tanstack/react-query';

import type { HikkaClient } from '@hikka/client';

import { queryKeys } from '@/core';

export function ignoredNotificationsOptions(client: HikkaClient) {
    return queryOptions({
        queryKey: queryKeys.settings.ignoredNotifications(),
        queryFn: () => client.settings.getIgnoredNotifications(),
    });
}
