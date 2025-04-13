import { QueryKey } from '@tanstack/react-query';

import getQueryClient from '../../../utils/get-query-client';
import getGlobalComments from '../../api/comments/getGlobalComments';
import useInfiniteList from '../use-infinite-list';

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
