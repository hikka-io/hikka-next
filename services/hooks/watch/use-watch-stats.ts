import { useQuery } from '@tanstack/react-query';

import getWatchStats, { Params } from '@/services/api/watch/getWatchStats';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    username: props.username,
});

export const key = (params: Params) => ['watch-stats', params.username];

const useWatchStats = (props: Params) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getWatchStats({ params }),
    });
};

export const prefetchWatchStats = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getWatchStats({ params }),
    });
};

export default useWatchStats;
