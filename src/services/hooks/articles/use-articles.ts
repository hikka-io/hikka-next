import { QueryKey } from '@tanstack/react-query';

import getArticles, { Params } from '@/services/api/articles/getArticles';
import getQueryClient from '@/utils/get-query-client';

import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = (props: Params): Params => ({
    page: props.page || 1,
    size: props.size || 10,
    sort: props.sort || ['created:desc'],
    author: props.author,
    draft: props.draft,
    categories: props.categories || [],
    tags: props.tags,
    content_slug: props.content_slug,
    content_type: props.content_type,
});

export const key = (params: Params): QueryKey => ['articles', params];

const useArticles = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getArticles({
                page: pageParam,
                size: params.size,
                params: {
                    categories: params.categories,
                    sort: params.sort,
                    author: params.author,
                    draft: params.draft,
                    tags: params.tags,
                    content_slug: params.content_slug,
                    content_type: params.content_type,
                },
            }),
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const prefetchArticles = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getArticles({
                params,
                page: pageParam,
            }),
    });
};

export default useArticles;
