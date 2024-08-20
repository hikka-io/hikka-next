import { useQuery } from '@tanstack/react-query';

import getAnimeCatalog from '@/services/api/anime/getAnimeCatalog';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitleList } from '@/utils/adapters/convert-title';

interface Props {
    value?: string;
}

const useAnimeSearchList = ({ value }: Props) => {
    const { titleLanguage } = useSettingsContext();

    return useQuery<API.WithPagination<API.Anime>, Error>({
        queryKey: ['animeSearchList', value],
        queryFn: () =>
            getAnimeCatalog({
                params: {
                    query: value,
                },
                size: 30,
            }),
        enabled: value !== undefined && value.length >= 3,
        select: (data) => ({
            ...data,
            list: convertTitleList<API.Anime>({
                titleLanguage: titleLanguage!,
                data: data.list,
            }),
        }),
    });
};

export default useAnimeSearchList;
