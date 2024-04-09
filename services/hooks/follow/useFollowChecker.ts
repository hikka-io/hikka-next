import { useQuery } from '@tanstack/react-query';

import checkFollow from '@/services/api/follow/checkFollow';

import useAuth from '../auth/useAuth';

const useFollowChecker = ({
    username,
    enabled = true,
}: {
    username: string;
    enabled?: boolean;
}) => {
    const { auth } = useAuth();

    return useQuery({
        queryKey: ['followChecker', username, { auth }],
        queryFn: () =>
            checkFollow({
                auth: auth!,
                username: username,
            }),
        enabled: enabled && Boolean(auth),
    });
};

export default useFollowChecker;
