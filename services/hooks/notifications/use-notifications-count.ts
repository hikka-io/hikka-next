import { useQuery } from '@tanstack/react-query';

import getNotificationsCount from '@/services/api/notifications/getNotificationsCount';
import getQueryClient from '@/utils/get-query-client';

export const key = () => ['notifications-count'];

const useNotificationsCount = () => {
    return useQuery({
        queryFn: () => getNotificationsCount(),
        queryKey: key(),
        staleTime: 0,
        refetchInterval: 30000,
    });
};

export const prefetchNotificationsCount = () => {
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryFn: () => getNotificationsCount(),
        queryKey: key(),
    });
};

export default useNotificationsCount;
