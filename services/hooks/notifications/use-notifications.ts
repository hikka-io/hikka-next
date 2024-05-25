import getNotifications from '@/services/api/notifications/getNotifications';
import useInfiniteList from '@/services/hooks/use-infinite-list';

const useNotifications = () => {
    return useInfiniteList({
        queryFn: ({ pageParam }) => getNotifications({ page: pageParam }),
        queryKey: ['notifications'],
        staleTime: 0,
    });
};

export default useNotifications;
