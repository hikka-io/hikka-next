import { useQuery } from '@tanstack/react-query';

import getAnimeInfo, { Params } from '@/services/api/anime/getAnimeInfo';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/title-adapter';

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
            convertTitle({
                titleLanguage: titleLanguage!,
                data: data,
            }),
    });
};

export default useAnimeInfo;
