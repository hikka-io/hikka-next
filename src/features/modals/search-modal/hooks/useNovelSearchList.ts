import { useQuery } from '@tanstack/react-query';

import getNovelCatalog from '@/services/api/novel/getNovelCatalog';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitleList } from '@/utils/adapters/convert-title';

interface Props {
    value?: string;
}

const useNovelSearchList = ({ value }: Props) => {
    const { titleLanguage } = useSettingsContext();

    return useQuery<API.WithPagination<API.Novel>, Error>({
        queryKey: ['novel-search-list', value],
        queryFn: () =>
            getNovelCatalog({
                params: {
                    query: value,
                },
                size: 30,
            }),
        enabled: value !== undefined && value.length >= 3,
        select: (data) => ({
            ...data,
            list: convertTitleList<API.Novel>({
                titleLanguage: titleLanguage!,
                data: data.list,
            }),
        }),
    });
};

export default useNovelSearchList;
