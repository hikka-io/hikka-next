import { MangaPaginationResponse } from '@hikka/client';
import { useQuery } from '@hikka/react';

interface Props {
    value?: string;
}

const useMangaSearchList = ({ value }: Props) => {
    return useQuery<MangaPaginationResponse, Error>({
        queryKey: ['manga-search-list', value],
        queryFn: (client) =>
            client.manga.searchMangas({ query: value }, { size: 60 }),
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });
};

export default useMangaSearchList;
