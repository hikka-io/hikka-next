import { useQuery } from '@tanstack/react-query';

import getFollowStats, { Params } from '@/services/api/follow/getFollowStats';

const useFollowStats = ({ username }: Params) => {
    return useQuery({
        queryKey: ['followStats', username],
        queryFn: () => getFollowStats({ params: { username } }),
    });
};

export default useFollowStats;
