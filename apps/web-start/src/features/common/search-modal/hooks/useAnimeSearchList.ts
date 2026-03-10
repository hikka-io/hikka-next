import { AnimePaginationResponse } from '@hikka/client';
import { useHikkaClient, useQuery } from '@hikka/react';

interface Props {
    value?: string;
}

const useAnimeSearchList = ({ value }: Props) => {
    const { client } = useHikkaClient();
    return useQuery<AnimePaginationResponse, Error>({
        queryKey: ['anime-search-list', value],
        queryFn: () =>
            client.anime.searchAnimes({ query: value }, { size: 60 }),
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });
};

export default useAnimeSearchList;
