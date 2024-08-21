import { QueryKey, useQuery } from '@tanstack/react-query';

import getClient, { Params } from '@/services/api/client/getClient';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    client_reference: props.client_reference,
});

export const key = (params: Params): QueryKey => [
    'client',
    params.client_reference,
];

const useClient = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            getClient({
                params,
            }),
        ...options,
        refetchOnWindowFocus: false,
    });
};

export const prefetchClient = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            getClient({
                params,
            }),
    });
};

export default useClient;
