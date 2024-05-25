import getTodoAnime, { Params } from '@/services/api/edit/todo/getTodoAnime';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnimeList } from '@/utils/anime-adapter';

const useTodoAnime = ({ param }: Params) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['list', param],
        queryFn: ({ pageParam = 1 }) =>
            getTodoAnime({
                params: { param },
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
