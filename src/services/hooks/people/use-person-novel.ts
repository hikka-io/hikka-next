import getPersonNovel, { Params } from '@/services/api/people/getPersonNovel';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/adapters/convert-title';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['person-novel', params.slug];

const usePersonNovel = (props: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getPersonNovel({
                params,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((p) => ({
                    ...p,
                    novel: convertTitle<API.NovelInfo>({
                        data: p.novel,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
        ...options,
    });
};

export const prefetchPersonNovel = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getPersonNovel({
                params,
                page: pageParam,
            }),
    });
};

export default usePersonNovel;
