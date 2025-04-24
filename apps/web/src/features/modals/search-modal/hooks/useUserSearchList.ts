import { UserResponse } from '@hikka/client';
import { useQuery } from '@hikka/react';

interface Props {
    value?: string;
}

const useUserSearchList = ({ value }: Props) => {
    return useQuery<UserResponse[], Error>({
        queryKey: ['user-search-list', value],
        queryFn: (client) => client.user.search({ query: value || '' }),
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });
};

export default useUserSearchList;
