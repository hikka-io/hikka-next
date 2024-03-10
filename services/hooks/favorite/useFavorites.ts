import getFavouriteList from '@/services/api/favourite/getFavouriteList';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useAuthContext } from '@/services/providers/auth-provider';

const useFavorites = <TContent extends API.Content>({
    username,
    content_type,
}: {
    username: string;
    content_type: API.ContentType;
}) => {
    const { secret } = useAuthContext();

    return useInfiniteList({
        queryKey: ['favorites', username, { secret, content_type }],
        queryFn: ({ pageParam = 1 }) =>
            getFavouriteList<TContent>({
                username: username,
                page: pageParam,
                size: 18,
                secret: secret,
                content_type: content_type,
            }),
        staleTime: 0,
    });
};

export default useFavorites;
