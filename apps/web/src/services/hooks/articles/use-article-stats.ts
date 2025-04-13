import { QueryKey, useQuery } from '@tanstack/react-query';

import getQueryClient from '@/utils/get-query-client';
import getArticleStats, { Params } from '../../api/articles/getArticleStats';

export const paramsBuilder = (props: Params): Params => ({});

export const key = (params: Params): QueryKey => ['article-top'];

const useArticleStats = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getArticleStats({ params }),
        ...options,
    });
};

export const prefetchArticleStats = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getArticleStats({ params }),
    });
};

export default useArticleStats;
