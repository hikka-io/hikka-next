import getQueryClient from '../../../utils/get-query-client';
import { Params } from '../../api/anime/getAnimeCharacters';
import getNovelCharacters from '../../api/novel/getNovelCharacters';
import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['novel-characters', params.slug];

const useNovelCharacters = (props: Params) => {
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getNovelCharacters({
                params,
                page: pageParam,
            }),
        refetchOnWindowFocus: false,
    });
};

export const prefetchNovelCharacters = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getNovelCharacters({
                params,
                page: pageParam,
            }),
    });
};

export default useNovelCharacters;
