import { useQuery } from '@tanstack/react-query';

import { unseenNotificationsCountOptions } from '@hikka/api';

import { useAuthToken } from '@/features/auth';

/** The unread count; 0 while signed out. Polling and refetch-on-return come from the query defaults. */
export function useUnseenNotifications(): number {
    const token = useAuthToken();
    const { data } = useQuery({
        ...unseenNotificationsCountOptions(),
        enabled: !!token,
    });

    return token ? (data?.unseen ?? 0) : 0;
}
