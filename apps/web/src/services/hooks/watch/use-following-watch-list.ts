import getQueryClient from '@/utils/get-query-client';
import getFollowingWatchList, {
    Params,
} from '../../api/watch/getFollowingWatchList';
import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['following-watch-list', params.slug];

const useFollowingWatchList = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getFollowingWatchList({
                params,
                page: pageParam,
            }),
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const prefetchFollowingWatchList = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getFollowingWatchList({
                params,
                page: pageParam,
            }),
    });
};

export default useFollowingWatchList;
