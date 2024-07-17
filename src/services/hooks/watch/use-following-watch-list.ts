import getFollowingWatchList, {
    Params,
} from '@/services/api/watch/getFollowingWatchList';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['following-watch-list', params.slug];

const useFollowingWatchList = (props: Params) => {
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getFollowingWatchList({
                params,
                page: pageParam,
            }),
        refetchOnWindowFocus: false,
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
