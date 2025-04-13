import getQueryClient from '@/utils/get-query-client';
import getCollections, { Params } from '../../api/collections/getCollections';
import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = (props: Params): Params => ({
    author: props.author || undefined,
    sort: props.sort || 'created',
    only_public: props.only_public || false,
    content_type: props.content_type || undefined,
});

export const key = (params: Params) => ['collections', params.author];

const useUserCollections = (props: Params) => {
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam }) =>
            getCollections({
                page: pageParam,
                params,
            }),
    });
};

export const prefetchUserCollections = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getCollections({
                page: pageParam,
                params,
            }),
    });
};

export default useUserCollections;
