import getCharacterAnime from '@/services/api/characters/getCharacterAnime';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnime } from '@/utils/animeAdapter';

const useCharacterAnime = ({ slug }: { slug: string }) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['characterAnime', slug],
        queryFn: ({ pageParam = 1 }) =>
            getCharacterAnime({
                slug: slug,
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
