import { useQuery } from '@tanstack/react-query';

import getNotificationsCount from '@/services/api/notifications/getNotificationsCount';

const useNotificationsCount = () => {
    return useQuery({
        queryFn: () => getNotificationsCount(),
        queryKey: ['notificationsCount'],
        staleTime: 0,
        refetchInterval: 30000,
    });
};

export default useNotificationsCount;
