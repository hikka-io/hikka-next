import { QueryKey, useQuery } from '@tanstack/react-query';

import getArticleTop, { Params } from '@/services/api/articles/getArticleTop';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    category: props.category,
});

export const key = (params: Params): QueryKey => [
    'article-top',
    params.category,
];

const useArticleTop = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getArticleTop({ params }),
        ...options,
    });
};

export const prefetchArticleTop = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getArticleTop({ params }),
    });
};

export default useArticleTop;
