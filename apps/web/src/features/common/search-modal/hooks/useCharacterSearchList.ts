import { CharactersSearchPaginationResponse } from '@hikka/client';
import { useHikkaClient, useQuery } from '@hikka/react';

interface Props {
    value?: string;
}

const useCharacterSearchList = ({ value }: Props) => {
    const { client } = useHikkaClient();
    return useQuery<CharactersSearchPaginationResponse, Error>({
        queryKey: ['character-search-list', value],
        queryFn: () =>
            client.characters.searchCharacters({ query: value }, { size: 60 }),
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });
};

export default useCharacterSearchList;
