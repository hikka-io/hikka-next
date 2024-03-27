import getCollections from '@/services/api/collections/getCollections';
import useInfiniteList from '@/services/hooks/useInfiniteList';

import useAuth from '../auth/useAuth';

const useUserCollections = ({ username }: { username: string }) => {
    const { auth } = useAuth();

    return useInfiniteList({
        queryKey: ['collections', username, { auth }],
        queryFn: ({ pageParam }) =>
            getCollections({
                author: username,
                page: pageParam,
                auth,
                sort: 'created',
            }),
    });
};

export default useUserCollections;
