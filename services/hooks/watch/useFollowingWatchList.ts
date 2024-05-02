import getFollowingWatchList from '@/services/api/watch/getFollowingWatchList';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useFollowingWatchList = ({ slug }: { slug: string }) => {
    return useInfiniteList({
        queryKey: ['followingWatchList', slug],
        queryFn: ({ pageParam = 1 }) =>
            getFollowingWatchList({
                params: { slug },
                page: pageParam,
            }),
    });
};

export default useFollowingWatchList;
