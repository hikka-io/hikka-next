import { MangaPaginationResponse } from '@hikka/client';
import { useHikkaClient, useQuery } from '@hikka/react';

interface Props {
    value?: string;
}

const useMangaSearchList = ({ value }: Props) => {
    const { client } = useHikkaClient();
    return useQuery<MangaPaginationResponse, Error>({
        queryKey: ['manga-search-list', value],
        queryFn: () =>
            client.manga.searchMangas({ query: value }, { size: 60 }),
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });
};

export default useMangaSearchList;
