import { useQuery } from '@tanstack/react-query';

import { Params } from '@/services/api/anime/getAnimeInfo';
import getNovelInfo from '@/services/api/novel/getNovelInfo';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/title-adapter';

const useNovelInfo = ({ slug }: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();

    return useQuery({
        queryKey: ['novel', slug],
        queryFn: () =>
            getNovelInfo({
                params: {
                    slug,
                },
            }),
        ...options,
        select: (data) =>
            convertTitle<API.NovelInfo>({
                titleLanguage: titleLanguage!,
                data: data,
            }),
    });
};

export default useNovelInfo;
