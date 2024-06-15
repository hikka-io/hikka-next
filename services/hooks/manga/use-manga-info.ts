import { useQuery } from '@tanstack/react-query';

import { Params } from '@/services/api/anime/getAnimeInfo';
import getMangaInfo from '@/services/api/manga/getMangaInfo';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/title-adapter';

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
            convertTitle<API.MangaInfo>({
                titleLanguage: titleLanguage!,
                data: data,
            }),
    });
};

export default useMangaInfo;
