import { useQuery } from '@tanstack/react-query';

import getNotificationsCount from '@/services/api/notifications/getNotificationsCount';
import { useAuthContext } from '@/services/providers/auth-provider';

const useNotificationsCount = () => {
    const { secret } = useAuthContext();

    return useQuery({
        queryFn: () => getNotificationsCount({ secret: secret }),
        queryKey: ['notificationsCount', { secret }],
        staleTime: 0,
        refetchInterval: 30000,
    });
};

export default useNotificationsCount;
