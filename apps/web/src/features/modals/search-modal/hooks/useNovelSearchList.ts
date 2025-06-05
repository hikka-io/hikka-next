import { NovelPaginationResponse } from '@hikka/client';
import { useQuery } from '@hikka/react';

interface Props {
    value?: string;
}

const useNovelSearchList = ({ value }: Props) => {
    return useQuery<NovelPaginationResponse, Error>({
        queryKey: ['novel-search-list', value],
        queryFn: (client) =>
            client.novel.searchNovels({ query: value }, { size: 60 }),
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });
};

export default useNovelSearchList;
