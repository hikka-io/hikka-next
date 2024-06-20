import { useQuery } from '@tanstack/react-query';

import getRead, { Params } from '@/services/api/read/getRead';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
    content_type: props.content_type,
});

export const key = (params: Params) => [
    'read',
    params.slug,
    params.content_type,
];

const useRead = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getRead({ params }),
        ...options,
    });
};

export const prefetchRead = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getRead({ params }),
    });
};

export default useRead;
