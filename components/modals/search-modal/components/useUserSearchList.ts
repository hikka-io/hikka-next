import { useQuery } from '@tanstack/react-query';

import getUser from '@/services/api/user/getUserList'; // ! ! !

interface Props {
    value?: string;
}

const useUserSearchList = ({ value }: Props) => {
    return useQuery<Array<API.User>, Error>({
        queryKey: ['userSearchList', value],
        queryFn: () =>
            getUser({
                params: {
                    query: value,
                },
            }),
        enabled: value !== undefined && value.length >= 3,
    });
};

export default useUserSearchList;