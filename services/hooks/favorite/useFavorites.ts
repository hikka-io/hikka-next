import getFavouriteList from '@/services/api/favourite/getFavouriteList';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useFavorites = (username: string, secret: string) => {
    return useInfiniteList({
        queryKey: ['favorites', { username, secret }],
        queryFn: ({ pageParam = 1 }) =>
            getFavouriteList({
                username: username,
                page: pageParam,
                secret: secret,
            }),
        staleTime: 0,
    });
};

export default useFavorites;
