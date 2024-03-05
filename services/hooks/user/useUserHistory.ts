import getUserHistory from '@/services/api/user/getUserHistory';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useUserHistory = ({ username }: { username: string }) => {
    return useInfiniteList({
        queryKey: ['history', username],
        queryFn: ({ pageParam }) =>
            getUserHistory({
                username: username,
                page: pageParam,
            }),
    });
};

export default useUserHistory;
