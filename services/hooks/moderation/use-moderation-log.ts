import getModerationLog, {
    Params,
} from '@/services/api/moderation/getModerationLog';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    sort: props.sort || undefined,
    target_type: props.target_type || undefined,
    author: props.author || undefined,
});

export const key = (params: Params) => ['moderation-log', params];

const useModerationLog = (props: Params) => {
    const { ...params } = paramsBuilder(props);

    return useInfiniteList({
        queryFn: ({ pageParam }) =>
            getModerationLog({ page: pageParam, params }),
        queryKey: key(params),
        staleTime: 0,
    });
};

export const prefetchModerationLog = (props: Params) => {
    const queryClient = getQueryClient();
    const { ...params } = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) => getModerationLog({ page: pageParam }),
    });
};

export default useModerationLog;
