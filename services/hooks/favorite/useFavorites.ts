import getFavouriteList from '@/services/api/favourite/getFavouriteList';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnime } from '@/utils/animeAdapter';

import useAuth from '../auth/useAuth';

const useFavorites = <TContent extends API.Content>({
    username,
    content_type,
}: {
    username: string;
    content_type: API.ContentType;
}) => {
    const { auth } = useAuth();
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['favorites', username, { auth, content_type }],
        queryFn: ({ pageParam = 1 }) =>
            getFavouriteList<TContent>({
                username: username,
                page: pageParam,
                size: 18,
                auth: auth,
                content_type: content_type,
            }),
        staleTime: 0,
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((s) => ({
                    ...s,
                    ...('title_ua' in s
                        ? convertAnime<API.AnimeInfo>({
                              titleLanguage: titleLanguage!,
                              anime: s,
                          })
                        : {}),
                })),
            })),
        }),
    });
};

export default useFavorites;
