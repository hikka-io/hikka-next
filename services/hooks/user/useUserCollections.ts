import getUserCollections from '@/services/api/collections/getUserCollections';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useUserCollections = ({
    username,
    secret,
}: {
    username: string;
    secret?: string;
}) => {
    return useInfiniteList({
        queryKey: ['collections', { username, secret }],
        queryFn: ({ pageParam }) =>
            getUserCollections({
                username: username,
                page: pageParam,
                secret,
            }),
    });
};

export default useUserCollections;
