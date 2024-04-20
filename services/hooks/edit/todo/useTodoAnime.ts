import getTodoAnime from '@/services/api/edit/todo/getTodoAnime';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnimeList } from '@/utils/animeAdapter';

const useTodoAnime = (param: string, auth: string) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['list', param, { auth }],
        queryFn: ({ pageParam = 1 }) =>
            getTodoAnime({
                param: param,
                auth: String(auth),
                page: pageParam,
                size: 18,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: convertAnimeList<API.Anime>({
                    anime: a.list,
                    titleLanguage: titleLanguage!,
                }),
            })),
        }),
    });
};

export default useTodoAnime;
