import { useQuery } from '@tanstack/react-query';

import getMangaCatalog from '@/services/api/manga/getMangaCatalog';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitleList } from '@/utils/adapters/convert-title';

interface Props {
    value?: string;
}

const useMangaSearchList = ({ value }: Props) => {
    const { titleLanguage } = useSettingsContext();

    return useQuery<API.WithPagination<API.Manga>, Error>({
        queryKey: ['manga-search-list', value],
        queryFn: () =>
            getMangaCatalog({
                params: {
                    query: value,
                },
                size: 30,
            }),
        enabled: value !== undefined && value.length >= 3,
        select: (data) => ({
            ...data,
            list: convertTitleList<API.Manga>({
                titleLanguage: titleLanguage!,
                data: data.list,
            }),
        }),
    });
};

export default useMangaSearchList;
