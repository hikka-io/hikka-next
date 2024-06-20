import { useQuery } from '@tanstack/react-query';

import getWatch, { Params } from '@/services/api/watch/getWatch';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['watch', params.slug];

const useWatch = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getWatch({ params }),
        ...options,
    });
};

export const prefetchWatch = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getWatch({ params }),
    });
};

export default useWatch;
