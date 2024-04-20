import { useQuery } from '@tanstack/react-query';

import getAnimeInfo from '@/services/api/anime/getAnimeInfo';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnime } from '@/utils/animeAdapter';

const useAnimeInfo = ({
    slug,
    enabled,
}: {
    slug: string;
    enabled?: boolean;
}) => {
    const { titleLanguage } = useSettingsContext();

    return useQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug }),
        enabled: enabled,
        select: (data) =>
            convertAnime<API.AnimeInfo>({
                titleLanguage: titleLanguage!,
                anime: data,
            }),
    });
};

export default useAnimeInfo;
