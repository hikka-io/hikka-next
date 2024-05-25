import getCollections from '@/services/api/collections/getCollections';
import useInfiniteList from '@/services/hooks/use-infinite-list';

const useUserCollections = ({ username }: { username: string }) => {
    return useInfiniteList({
        queryKey: ['collections', username],
        queryFn: ({ pageParam }) =>
            getCollections({
                page: pageParam,
                params: {
                    sort: 'created',
                    only_public: false,
                    author: username,
                },
            }),
    });
};

export default useUserCollections;
