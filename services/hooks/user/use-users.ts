import { useQuery } from '@tanstack/react-query';

import getUsers, { Params } from '@/services/api/user/getUsers';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    query: props.query || undefined,
});

export const key = (params: Params) => ['users', params];

const useUsers = (props: Params) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            getUsers({
                params,
            }),
    });
};

export const prefetchUsers = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            getUsers({
                params,
            }),
    });
};

export default useUsers;
