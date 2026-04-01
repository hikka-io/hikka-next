import { HikkaClient } from '@hikka/client';
import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';

export function ignoredNotificationsOptions(client: HikkaClient) {
    return queryOptions({
        queryKey: queryKeys.settings.ignoredNotifications(),
        queryFn: () => client.settings.getIgnoredNotifications(),
    });
}
