import { Params } from '@/services/api/anime/getAnimeCharacters';
import getNovelCharacters from '@/services/api/novel/getNovelCharacters';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import getQueryClient from '@/utils/get-query-client';

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
