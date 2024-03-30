import getFollowingWatchList from '@/services/api/watch/getFollowingWatchList';
import useAuth from '@/services/hooks/auth/useAuth';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useFollowingWatchList = ({ slug }: { slug: string }) => {
    const { auth } = useAuth();

    return useInfiniteList({
        queryKey: ['followingWatchList', slug, { auth }],
        queryFn: ({ pageParam = 1 }) =>
            getFollowingWatchList({
                slug: slug,
                auth: String(auth),
                page: pageParam,
            }),
    });
};

export default useFollowingWatchList;
