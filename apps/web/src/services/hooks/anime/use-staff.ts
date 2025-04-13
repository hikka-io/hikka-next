import { QueryKey } from '@tanstack/react-query';

import getQueryClient from '@/utils/get-query-client';
import getAnimeStaff, { Params } from '../../api/anime/getAnimeStaff';
import useInfiniteList from '../use-infinite-list';

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
