import { useQuery } from '@tanstack/react-query';

import getFollowStats from '@/services/api/follow/getFollowStats';

const useFollowStats = (username: string) => {
    return useQuery({
        queryKey: ['followStats', username],
        queryFn: () => getFollowStats({ username: username }),
    });
};

export default useFollowStats;
