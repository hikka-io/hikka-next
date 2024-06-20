import getFavouriteList, {
    FavoriteContent,
    Params,
} from '@/services/api/favourite/getFavouriteList';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitle } from '@/utils/title-adapter';

export const paramsBuilder = (props: Params): Params => ({
    username: props.username,
    content_type: props.content_type,
});

export const key = (params: Params) => [
    'favorites',
    params.username,
    { content_type: params.content_type },
];

const useFavorites = <TContent extends API.Content>(props: Params) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getFavouriteList<TContent>({
                page: pageParam,
                size: 18,
                params,
            }),
        staleTime: 0,
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((s) => ({
                    ...s,
                    ...convertTitle<FavoriteContent>({
                        titleLanguage: titleLanguage!,
                        data: s,
                    }),
                })),
            })),
        }),
    });
};

export const prefetchFavorites = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getFavouriteList({
                page: pageParam,
                size: 18,
                params,
            }),
    });
};

export default useFavorites;
