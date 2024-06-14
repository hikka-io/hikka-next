import getPersonAnime, { Params } from '@/services/api/people/getPersonAnime';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnime } from '@/utils/title-adapter';

const usePersonAnime = ({ slug }: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['personAnime', slug],
        queryFn: ({ pageParam = 1 }) =>
            getPersonAnime({
                params: { slug },
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((p) => ({
                    ...p,
                    anime: convertAnime<API.AnimeInfo>({
                        anime: p.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
        ...options,
    });
};

export default usePersonAnime;
