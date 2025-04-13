import getQueryClient from '../../../../utils/get-query-client';
import getEditTop from '../../../api/stats/edit/getEditTop';
import useInfiniteList from '../../use-infinite-list';

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
