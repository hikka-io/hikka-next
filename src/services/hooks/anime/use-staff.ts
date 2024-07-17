import { QueryKey } from '@tanstack/react-query';

import getAnimeStaff, { Params } from '@/services/api/anime/getAnimeStaff';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug || '',
});

export const key = (params: Params): QueryKey => ['staff', params.slug];

const useStaff = (props: Params) => {
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getAnimeStaff({ params, page: pageParam }),
        refetchOnWindowFocus: false,
    });
};

export const prefetchStaff = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getAnimeStaff({ params, page: pageParam }),
    });
};

export default useStaff;
