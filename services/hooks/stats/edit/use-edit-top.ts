import getEditTop from '@/services/api/stats/edit/getEditTop';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import getQueryClient from '@/utils/get-query-client';

export const key = () => ['edit-top-stats'];

const useEditTop = () => {
    return useInfiniteList({
        queryKey: key(),
        queryFn: ({ pageParam }) =>
            getEditTop({
                page: pageParam,
            }),
    });
};

export const prefetchEditTop = () => {
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(),
        queryFn: ({ pageParam = 1 }) =>
            getEditTop({
                page: pageParam,
            }),
    });
};

export default useEditTop;
