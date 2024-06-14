import { useQuery } from '@tanstack/react-query';

import { Params } from '@/services/api/anime/getAnimeInfo';
import getMangaInfo from '@/services/api/manga/getMangaInfo';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertManga } from '@/utils/title-adapter';

const useMangaInfo = ({ slug }: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();

    return useQuery({
        queryKey: ['manga', slug],
        queryFn: () =>
            getMangaInfo({
                params: {
                    slug,
                },
            }),
        ...options,
        select: (data) =>
            convertManga<API.MangaInfo>({
                titleLanguage: titleLanguage!,
                manga: data,
            }),
    });
};

export default useMangaInfo;
