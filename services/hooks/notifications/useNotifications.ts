import getNotifications from '@/services/api/notifications/getNotifications';
import useInfiniteList from '@/services/hooks/useInfiniteList';




import useAuth from '../auth/useAuth';


const useNotifications = () => {
    const { auth } = useAuth();

    return useInfiniteList({
        queryFn: ({ pageParam }) =>
            getNotifications({ page: pageParam, auth: auth }),
        queryKey: ['notifications', { auth }],
        staleTime: 0,
    });
};

export default useNotifications;
