import getFavouriteList from '@/services/api/favourite/getFavouriteList';
import useInfiniteList from '@/services/hooks/useInfiniteList';




import useAuth from '../auth/useAuth';


const useFavorites = <TContent extends API.Content>({
    username,
    content_type,
}: {
    username: string;
    content_type: API.ContentType;
}) => {
    const { auth } = useAuth();

    return useInfiniteList({
        queryKey: ['favorites', username, { auth, content_type }],
        queryFn: ({ pageParam = 1 }) =>
            getFavouriteList<TContent>({
                username: username,
                page: pageParam,
                size: 18,
                auth: auth,
                content_type: content_type,
            }),
        staleTime: 0,
    });
};

export default useFavorites;
