import { useQuery } from '@tanstack/react-query';

import getUserActivity, { Params } from '@/services/api/user/getUserActivity';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    username: props.username,
});

export const key = (params: Params) => ['activity-stats', params.username];

const useUserActivity = (props: Params) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getUserActivity({ params }),
    });
};

export const prefetchUserActivity = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getUserActivity({ params }),
    });
};

export default useUserActivity;
