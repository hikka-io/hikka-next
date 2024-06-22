import { QueryKey } from '@tanstack/react-query';

import getGlobalComments from '@/services/api/comments/getGlobalComments';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import getQueryClient from '@/utils/get-query-client';

export const key = (): QueryKey => ['global-comments'];

const useGlobalComments = () => {
    return useInfiniteList({
        queryKey: key(),
        queryFn: ({ pageParam }) =>
            getGlobalComments({
                page: pageParam,
            }),
    });
};

export const prefetchGlobalComments = () => {
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(),
        queryFn: ({ pageParam = 1 }) =>
            getGlobalComments({
                page: pageParam,
            }),
    });
};

export default useGlobalComments;
