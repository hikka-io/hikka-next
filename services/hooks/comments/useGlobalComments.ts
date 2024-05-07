import getGlobalComments from '@/services/api/comments/getGlobalComments';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useGlobalComments = () => {
    return useInfiniteList({
        queryKey: ['globalComments'],
        queryFn: ({ pageParam }) =>
            getGlobalComments({
                page: pageParam,
            }),
    });
};

export default useGlobalComments;
