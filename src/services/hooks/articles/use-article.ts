import { QueryKey, useQuery } from '@tanstack/react-query';

import getArticle, { Params } from '@/services/api/articles/getArticle';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params): QueryKey => ['article', params.slug];

const useArticle = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getArticle({ params }),
        ...options,
    });
};

export const prefetchArticle = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getArticle({ params }),
    });
};

export default useArticle;
