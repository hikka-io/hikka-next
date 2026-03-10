import { UserResponse } from '@hikka/client';
import { useHikkaClient, useQuery } from '@hikka/react';

interface Props {
    value?: string;
}

const useUserSearchList = ({ value }: Props) => {
    const { client } = useHikkaClient();
    return useQuery<UserResponse[], Error>({
        queryKey: ['user-search-list', value],
        queryFn: () => client.user.searchUsers({ query: value || '' }),
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });
};

export default useUserSearchList;
