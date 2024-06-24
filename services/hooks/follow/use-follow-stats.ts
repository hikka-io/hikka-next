import { useQuery } from '@tanstack/react-query';

import getFollowStats, { Params } from '@/services/api/follow/getFollowStats';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    username: props.username,
});

export const key = (params: Params) => ['follow-stats', params.username];

const useFollowStats = (props: Params) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getFollowStats({ params }),
    });
};

export const prefetchFollowStats = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getFollowStats({ params }),
    });
};

export default useFollowStats;
