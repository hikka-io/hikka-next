import getNotifications from '@/services/api/notifications/getNotifications';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useNotifications = (secret: string) => {
    return useInfiniteList({
        queryFn: ({ pageParam }) =>
            getNotifications({ page: pageParam, secret: secret }),
        queryKey: ['notifications', secret],
        staleTime: 0,
    });
};

export default useNotifications;