import { QueryKey } from '@tanstack/react-query';

import getAnimeCharacters, {
    Params,
} from '@/services/api/anime/getAnimeCharacters';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import getQueryClient from '@/utils/get-query-client';

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
