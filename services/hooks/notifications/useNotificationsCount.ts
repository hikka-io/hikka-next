import { useQuery } from '@tanstack/react-query';

import getNotificationsCount from '@/services/api/notifications/getNotificationsCount';

import useAuth from '../auth/useAuth';

const useNotificationsCount = () => {
    const { auth } = useAuth();

    return useQuery({
        queryFn: () => getNotificationsCount({ auth: auth }),
        queryKey: ['notificationsCount', { auth }],
        staleTime: 0,
        refetchInterval: 30000,
    });
};

export default useNotificationsCount;
