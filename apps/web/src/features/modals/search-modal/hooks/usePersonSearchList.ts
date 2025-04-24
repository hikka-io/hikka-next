import { PersonSearchPaginationResponse } from '@hikka/client';
import { useQuery } from '@hikka/react';

interface Props {
    value?: string;
}

const usePersonSearchList = ({ value }: Props) => {
    return useQuery<PersonSearchPaginationResponse, Error>({
        queryKey: ['person-search-list', value],
        queryFn: (client) =>
            client.people.search({ query: value }, { size: 60 }),
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });
};

export default usePersonSearchList;
