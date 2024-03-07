import getUserCollections from '@/services/api/collections/getUserCollections';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useAuthContext } from '@/services/providers/auth-provider';

const useUserCollections = ({ username }: { username: string }) => {
    const { secret } = useAuthContext();

    return useInfiniteList({
        queryKey: ['collections', username, { secret }],
        queryFn: ({ pageParam }) =>
            getUserCollections({
                username: username,
                page: pageParam,
                secret,
            }),
    });
};

export default useUserCollections;
