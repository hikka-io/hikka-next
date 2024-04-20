import getPersonCharacters from '@/services/api/people/getPersonCharacters';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnime } from '@/utils/animeAdapter';

const usePersonCharacters = ({ slug }: { slug: string }) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['personCharacters', slug],
        queryFn: ({ pageParam = 1 }) =>
            getPersonCharacters({
                slug: slug,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((ch) => ({
                    ...ch,
                    anime: convertAnime<API.AnimeInfo>({
                        anime: ch.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export default usePersonCharacters;
