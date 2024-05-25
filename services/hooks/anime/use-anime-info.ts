import { useQuery } from '@tanstack/react-query';

import getAnimeInfo, { Params } from '@/services/api/anime/getAnimeInfo';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnime } from '@/utils/animeAdapter';

const useAnimeInfo = ({ slug }: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();

    return useQuery({
        queryKey: ['anime', slug],
        queryFn: () =>
            getAnimeInfo({
                params: {
                    slug,
                },
            }),
        ...options,
        select: (data) =>
            convertAnime<API.AnimeInfo>({
                titleLanguage: titleLanguage!,
                anime: data,
            }),
    });
};

export default useAnimeInfo;
