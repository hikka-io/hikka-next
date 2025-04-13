import getQueryClient from '../../../utils/get-query-client';
import getNotifications from '../../api/notifications/getNotifications';
import useInfiniteList from '../use-infinite-list';

export const key = () => ['notifications'];

const useNotifications = () => {
    return useInfiniteList({
        queryFn: ({ pageParam }) => getNotifications({ page: pageParam }),
        queryKey: key(),
        staleTime: 0,
    });
};

export const prefetchNotifications = () => {
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(),
        queryFn: ({ pageParam = 1 }) => getNotifications({ page: pageParam }),
    });
};

export default useNotifications;
