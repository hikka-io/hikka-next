import { CharactersSearchPaginationResponse } from '@hikka/client';
import { useQuery } from '@hikka/react';

interface Props {
    value?: string;
}

const useCharacterSearchList = ({ value }: Props) => {
    return useQuery<CharactersSearchPaginationResponse, Error>({
        queryKey: ['character-search-list', value],
        queryFn: (client) =>
            client.characters.search({ query: value }, { size: 60 }),
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });
};

export default useCharacterSearchList;
