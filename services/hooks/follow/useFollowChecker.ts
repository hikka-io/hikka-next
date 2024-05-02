import { useQuery } from '@tanstack/react-query';

import checkFollow from '@/services/api/follow/checkFollow';

const useFollowChecker = ({
    username,
    enabled = true,
}: {
    username: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['followChecker', username],
        queryFn: () =>
            checkFollow({
                params: { username },
            }),
        enabled: enabled,
    });
};

export default useFollowChecker;
