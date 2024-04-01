import { useQuery } from '@tanstack/react-query';

import getCharacters from '@/services/api/characters/getCharacters';

interface Props {
    value?: string;
}

const useCharacterSearchList = ({ value }: Props) => {
    return useQuery<API.WithPagination<API.Character>, Error>({
        queryKey: ['characterSearchList', value],
        queryFn: () =>
            getCharacters({
                query: value,
            }),
        enabled: value !== undefined && value.length >= 3,
    });
};

export default useCharacterSearchList;
