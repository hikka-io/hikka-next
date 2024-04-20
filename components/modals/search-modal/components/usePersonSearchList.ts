import { useQuery } from '@tanstack/react-query';

import getPeople from '@/services/api/people/getPeople';

interface Props {
    value?: string;
}

const usePersonSearchList = ({ value }: Props) => {
    return useQuery<API.WithPagination<API.Person>, Error>({
        queryKey: ['personSearchList', value],
        queryFn: () =>
            getPeople({
                query: value,
                size: 30,
            }),
        enabled: value !== undefined && value.length >= 3,
    });
};

export default usePersonSearchList;
