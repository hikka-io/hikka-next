import { useQuery } from '@tanstack/react-query';

import checkFollow from '@/services/api/follow/checkFollow';

const useFollowChecker = (
    username: string,
    secret: string,
    enabled?: boolean,
) => {
    return useQuery({
        queryKey: ['followChecker', secret, username],
        queryFn: () =>
            checkFollow({
                secret: secret,
                username: username,
            }),
        enabled: enabled,
    });
};

export default useFollowChecker;
