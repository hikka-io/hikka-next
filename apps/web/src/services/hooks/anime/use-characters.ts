import { QueryKey } from '@tanstack/react-query';

import getQueryClient from '../../../utils/get-query-client';
import getAnimeCharacters, { Params } from '../../api/anime/getAnimeCharacters';
import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug || '',
});

export const key = (params: Params): QueryKey => ['characters', params.slug];

const useCharacters = (props: Params) => {
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getAnimeCharacters({
                params,
                page: pageParam,
            }),
        refetchOnWindowFocus: false,
    });
};

export const prefetchCharacters = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getAnimeCharacters({
                params,
                page: pageParam,
            }),
    });
};

export default useCharacters;
