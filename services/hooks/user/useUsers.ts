import { useQuery } from '@tanstack/react-query';

import getUsers, { Params } from '@/services/api/user/getUsers';

const useUsers = (params: Params) => {
    return useQuery({
        queryKey: ['users', { ...params }],
        queryFn: () =>
            getUsers({
                params,
            }),
    });
};

export default useUsers;
