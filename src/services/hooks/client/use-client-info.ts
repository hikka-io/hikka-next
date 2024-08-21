import { QueryKey, useQuery } from '@tanstack/react-query';

import getFullClient, { Params } from '@/services/api/client/getFullClient';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    client_reference: props.client_reference,
});

export const key = (params: Params): QueryKey => [
    'full-client',
    params.client_reference,
];

const useClientInfo = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            getFullClient({
                params,
            }),
        ...options,
        refetchOnWindowFocus: false,
    });
};

export const prefetchClientInfo = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            getFullClient({
                params,
            }),
    });
};

export default useClientInfo;
