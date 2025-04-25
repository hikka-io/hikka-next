import { NovelPaginationResponse } from '@hikka/client';
import { useQuery } from '@hikka/react';

import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitleList } from '@/utils/adapters/convert-title';

interface Props {
    value?: string;
}

const useNovelSearchList = ({ value }: Props) => {
    const { titleLanguage } = useSettingsContext();

    return useQuery<NovelPaginationResponse, Error>({
        queryKey: ['novel-search-list', value],
        queryFn: (client) =>
            client.novel.searchNovels({ query: value }, { size: 60 }),
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

export default useNovelSearchList;
