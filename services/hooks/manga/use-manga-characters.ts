import { Params } from '@/services/api/anime/getAnimeCharacters';
import getMangaCharacters from '@/services/api/manga/getMangaCharacters';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import getQueryClient from '@/utils/get-query-client';

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
