import { useQuery } from '@tanstack/react-query';

import checkFollow, { Params } from '@/services/api/follow/checkFollow';

const useFollowChecker = (
    { username }: Params,
    options?: Hikka.QueryOptions,
) => {
    return useQuery({
        queryKey: ['followChecker', username],
        queryFn: () =>
            checkFollow({
                params: { username },
            }),
        ...options,
    });
};

export default useFollowChecker;
