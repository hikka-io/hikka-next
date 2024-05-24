import getFavouriteList, {
    Params,
} from '@/services/api/favourite/getFavouriteList';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnime } from '@/utils/animeAdapter';

const useFavorites = <TContent extends API.Content>({
    username,
    content_type,
}: Params) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['favorites', username, { content_type }],
        queryFn: ({ pageParam = 1 }) =>
            getFavouriteList<TContent>({
                page: pageParam,
                size: 18,
                params: {
                    username,
                    content_type,
                },
            }),
        staleTime: 0,
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((s) => ({
                    ...s,
                    ...(s.data_type === 'anime'
                        ? convertAnime<API.AnimeInfo>({
                              titleLanguage: titleLanguage!,
                              anime: s as API.AnimeInfo,
                          })
                        : {}),
                })),
            })),
        }),
    });
};

export default useFavorites;
