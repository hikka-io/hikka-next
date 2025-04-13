import getQueryClient from '../../../utils/get-query-client';
import { Params } from '../../api/anime/getAnimeCharacters';
import getMangaCharacters from '../../api/manga/getMangaCharacters';
import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['manga-characters', params.slug];

const useMangaCharacters = (props: Params) => {
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getMangaCharacters({
                params,
                page: pageParam,
            }),
        refetchOnWindowFocus: false,
    });
};

export const prefetchMangaCharacters = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getMangaCharacters({
                params,
                page: pageParam,
            }),
    });
};

export default useMangaCharacters;
