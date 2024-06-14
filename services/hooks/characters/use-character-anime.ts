import getCharacterAnime, {
    Params,
} from '@/services/api/characters/getCharacterAnime';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnime } from '@/utils/title-adapter';

const useCharacterAnime = ({ slug }: Params) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['characterAnime', slug],
        queryFn: ({ pageParam = 1 }) =>
            getCharacterAnime({
                params: {
                    slug,
                },
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((ch) => ({
                    ...ch,
                    anime: convertAnime<API.Anime>({
                        anime: ch.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export default useCharacterAnime;
