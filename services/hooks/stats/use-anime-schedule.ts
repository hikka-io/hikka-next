import getAnimeSchedule, {
    Params,
} from '@/services/api/stats/getAnimeSchedule';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitle } from '@/utils/title-adapter';

const paramsBuilder = (props: Params) => ({
    airing_season: props.airing_season || undefined,
    status: props.status || undefined,
    only_watch: props.only_watch || undefined,
});

const key = (params: Params) => ['anime-schedule', params];

const useAnimeSchedule = (props: Params) => {
    const { titleLanguage } = useSettingsContext();

    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getAnimeSchedule({
                params,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((s) => ({
                    ...s,
                    anime: convertTitle<API.AnimeInfo>({
                        data: s.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export const prefetchAnimeSchedule = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getAnimeSchedule({
                params,
                page: pageParam,
            }),
    });
};

export default useAnimeSchedule;
