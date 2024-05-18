import { QueryClient } from '@tanstack/query-core';

import getFollowStats from '@/services/api/follow/getFollowStats';
import getUserInfo from '@/services/api/user/getUserInfo';
import getWatchStats from '@/services/api/watch/getWatchStats';

interface Props {
    queryClient: QueryClient;
    params: {
        username: string;
    };
}

const prefetchQueries = async ({
    queryClient,
    params: { username },
}: Props) => {
    await Promise.all([
        await queryClient.prefetchQuery({
            queryKey: ['user', username],
            queryFn: ({ meta }) =>
                getUserInfo({
                    params: {
                        username,
                    },
                }),
        }),

        await queryClient.prefetchQuery({
            queryKey: ['watchStats', username],
            queryFn: ({ meta }) =>
                getWatchStats({
                    params: {
                        username,
                    },
                }),
        }),

        await queryClient.prefetchQuery({
            queryKey: ['followStats', username],
            queryFn: ({ meta }) =>
                getFollowStats({
                    params: {
                        username,
                    },
                }),
        }),
    ]);
};

export default prefetchQueries;
