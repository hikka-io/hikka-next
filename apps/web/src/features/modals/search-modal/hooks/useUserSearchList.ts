import { useQuery } from '@tanstack/react-query';

import getUsers from '../../../../services/api/user/getUsers';

interface Props {
    value?: string;
}

const useUserSearchList = ({ value }: Props) => {
    return useQuery<Array<API.User>, Error>({
        queryKey: ['userSearchList', value],
        queryFn: () =>
            getUsers({
                params: {
                    query: value,
                },
            }),
        enabled: value !== undefined && value.length >= 3,
    });
};

export default useUserSearchList;
