import { convertTitle } from '@/utils/adapters/convert-title';
import getQueryClient from '@/utils/get-query-client';
import getPersonAnime, { Params } from '../../api/people/getPersonAnime';
import { useSettingsContext } from '../../providers/settings-provider';
import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['person-anime', params.slug];

const usePersonAnime = (props: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getPersonAnime({
                params,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((p) => ({
                    ...p,
                    anime: convertTitle<API.AnimeInfo>({
                        data: p.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
        ...options,
    });
};

export const prefetchPersonAnime = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getPersonAnime({
                params,
                page: pageParam,
            }),
    });
};

export default usePersonAnime;
