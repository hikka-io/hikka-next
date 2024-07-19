import { QueryKey } from '@tanstack/react-query';

import getComments, { Params } from '@/services/api/comments/getComments';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug || '',
    content_type: props.content_type || 'anime',
});

export const key = (params: Params): QueryKey => [
    'comments',
    params.slug,
    params.content_type,
];

const useComments = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam }) =>
            getComments({
                params,
                page: pageParam,
            }),
        ...options,
    });
};

export const prefetchComments = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getComments({
                params,
                page: pageParam,
            }),
    });
};

export default useComments;
