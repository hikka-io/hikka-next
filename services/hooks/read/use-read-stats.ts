import { useQuery } from '@tanstack/react-query';

import getReadStats, { Params } from '@/services/api/read/getReadStats';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    username: props.username,
    content_type: props.content_type,
});

export const key = (params: Params) => [
    'read-stats',
    params.username,
    params.content_type,
];

const useReadStats = (props: Params) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getReadStats({ params }),
    });
};

export const prefetchReadStats = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getReadStats({ params }),
    });
};

export default useReadStats;
