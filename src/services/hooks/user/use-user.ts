import { useQuery } from '@tanstack/react-query';

import getUserInfo, { Params } from '@/services/api/user/getUserInfo';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    username: props.username,
});

export const key = (params: Params) => ['user', params.username];

const useUser = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getUserInfo({ params }),
        enabled: params.username !== undefined,
        ...options,
    });
};

export const prefetchUser = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getUserInfo({ params }),
    });
};

export default useUser;
