import getFavouriteList from '@/services/api/favourite/getFavouriteList';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useAuthContext } from '@/services/providers/auth-provider';

const useFavorites = ({ username }: { username: string }) => {
    const { secret } = useAuthContext();

    return useInfiniteList({
        queryKey: ['favorites', username, { secret }],
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
