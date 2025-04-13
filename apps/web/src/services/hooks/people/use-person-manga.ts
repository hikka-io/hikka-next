import { convertTitle } from '../../../utils/adapters/convert-title';
import getQueryClient from '../../../utils/get-query-client';
import getPersonManga, { Params } from '../../api/people/getPersonManga';
import { useSettingsContext } from '../../providers/settings-provider';
import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['person-manga', params.slug];

const usePersonManga = (props: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getPersonManga({
                params,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((p) => ({
                    ...p,
                    manga: convertTitle<API.MangaInfo>({
                        data: p.manga,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
        ...options,
    });
};

export const prefetchPersonManga = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getPersonManga({
                params,
                page: pageParam,
            }),
    });
};

export default usePersonManga;
