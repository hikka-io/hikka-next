import getUserCollections from '@/services/api/collections/getUserCollections';
import useInfiniteList from '@/services/hooks/useInfiniteList';




import useAuth from '../auth/useAuth';


const useUserCollections = ({ username }: { username: string }) => {
    const { auth } = useAuth();

    return useInfiniteList({
        queryKey: ['collections', username, { auth }],
        queryFn: ({ pageParam }) =>
            getUserCollections({
                username: username,
                page: pageParam,
                auth,
            }),
    });
};

export default useUserCollections;
