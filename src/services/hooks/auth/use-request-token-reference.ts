import { QueryKey, useQuery } from '@tanstack/react-query';

import requestTokenReference, {
    Params,
} from '@/services/api/auth/requestTokenReference';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    client_reference: props.client_reference,
    scope: props.scope,
});

export const key = (params: Params): QueryKey => [
    'token-reference',
    params.client_reference,
];

const useRequestTokenReference = (
    props: Params,
    options?: Hikka.QueryOptions,
) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            requestTokenReference({
                params,
            }),
        ...options,
        refetchOnWindowFocus: false,
    });
};

export const prefetchRequestTokenReference = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            requestTokenReference({
                params,
            }),
    });
};

export default useRequestTokenReference;
