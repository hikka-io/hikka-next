import { PersonSearchPaginationResponse } from '@hikka/client';
import { useHikkaClient, useQuery } from '@hikka/react';

interface Props {
    value?: string;
}

const usePersonSearchList = ({ value }: Props) => {
    const { client } = useHikkaClient();
    return useQuery<PersonSearchPaginationResponse, Error>({
        queryKey: ['person-search-list', value],
        queryFn: () =>
            client.people.searchPeople({ query: value }, { size: 60 }),
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });
};

export default usePersonSearchList;
