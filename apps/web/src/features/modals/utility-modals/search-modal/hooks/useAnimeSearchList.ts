import { AnimePaginationResponse } from '@hikka/client';
import { useQuery } from '@hikka/react';

interface Props {
    value?: string;
}

const useAnimeSearchList = ({ value }: Props) => {
    return useQuery<AnimePaginationResponse, Error>({
        queryKey: ['anime-search-list', value],
        queryFn: (client) =>
            client.anime.searchAnimes({ query: value }, { size: 60 }),
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });
};

export default useAnimeSearchList;
