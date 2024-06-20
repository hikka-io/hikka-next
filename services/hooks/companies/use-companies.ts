import { useQuery } from '@tanstack/react-query';

import getCompanies, { Params } from '@/services/api/companies/getCompanies';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    query: props.query || '',
    type: props.type || 'studio',
});

export const key = (params: Params) => ['companies', params];

const useCompanies = (props: Params) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            getCompanies({
                params,
            }),
    });
};

export const prefetchCompanies = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            getCompanies({
                params,
            }),
    });
};

export default useCompanies;
