import { QueryKey, useQuery } from '@tanstack/react-query';

import getArticles, { Params } from '@/services/api/articles/getArticles';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    page: props.page || 1,
    size: props.size || 10,
    sort: props.sort || ['created:desc'],
    author: props.author,
    draft: props.draft,
});

export const key = (params: Params): QueryKey => ['articles', params];

const useCollections = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            getArticles({
                page: params.page,
                size: params.size,
                params: {
                    sort: params.sort,
                    author: params.author,
                    draft: params.draft,
                },
            }),
        ...options,
    });
};

export const prefetchCollections = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            getArticles({
                params,
            }),
    });
};

export default useCollections;
