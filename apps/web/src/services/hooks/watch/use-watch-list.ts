import { QueryKey } from '@tanstack/react-query';

import { convertTitle } from '../../../utils/adapters/convert-title';
import getQueryClient from '../../../utils/get-query-client';
import getWatchList, { Params } from '../../api/watch/getWatchList';
import { useSettingsContext } from '../../providers/settings-provider';
import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = ({ username, ...props }: Params): Params => ({
    username,
    watch_status: props.watch_status || 'watching',
    media_type: props.media_type || [],
    status: props.status || [],
    season: props.season || [],
    rating: props.rating || [],
    genres: props.genres || [],
    studios: props.studios || [],
    sort: props.sort || ['watch_score:desc'],
    years: props.years || [],
});

export const key = (params: Params): QueryKey => ['watch-list', params];

const useWatchList = ({ username, watch_status, ...props }: Params) => {
    const { titleLanguage } = useSettingsContext();

    const params = paramsBuilder({
        watch_status,
        username,
        ...props,
    });

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getWatchList({
                params,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((b) => ({
                    ...b,
                    anime: convertTitle<API.Anime>({
                        data: b.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export const prefetchWatchList = (props: Params) => {
    const queryClient = getQueryClient();

    const params = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getWatchList({
                params,
                page: pageParam,
            }),
    });
};

export default useWatchList;
