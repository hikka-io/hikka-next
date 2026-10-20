import { useQuery } from '@tanstack/react-query';

import { unseenNotificationsCountOptions } from '@hikka/api';

import { useAuthToken } from '@/features/auth';

export function useUnseenNotifications(): number {
    const token = useAuthToken();
    const { data } = useQuery({
        ...unseenNotificationsCountOptions(),
        enabled: !!token,
    });

    return token ? (data?.unseen ?? 0) : 0;
}
