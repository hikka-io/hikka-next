import getNotifications from '@/services/api/notifications/getNotifications';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useAuthContext } from '@/services/providers/auth-provider';

const useNotifications = () => {
    const { secret } = useAuthContext();

    return useInfiniteList({
        queryFn: ({ pageParam }) =>
            getNotifications({ page: pageParam, secret: secret }),
        queryKey: ['notifications', { secret }],
        staleTime: 0,
    });
};

export default useNotifications;
