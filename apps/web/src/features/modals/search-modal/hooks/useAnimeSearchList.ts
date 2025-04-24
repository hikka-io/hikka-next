import { AnimePaginationResponse } from '@hikka/client';
import { useQuery } from '@hikka/react';

import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitleList } from '@/utils/adapters/convert-title';

interface Props {
    value?: string;
}

const useAnimeSearchList = ({ value }: Props) => {
    const { titleLanguage } = useSettingsContext();

    return useQuery<AnimePaginationResponse, Error>({
        queryKey: ['anime-search-list', value],
        queryFn: (client) =>
            client.anime.search({ query: value }, { size: 60 }),
        options: {
            enabled: value !== undefined && value.length >= 3,
            select: (data) => ({
                ...data,
                list: convertTitleList({
                    titleLanguage: titleLanguage!,
                    data: data.list as any,
                }),
            }),
        },
    });
};

export default useAnimeSearchList;
