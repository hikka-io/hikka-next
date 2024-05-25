import { useQuery } from '@tanstack/react-query';

import getWatchStats, { Params } from '@/services/api/watch/getWatchStats';

const useWatchStats = ({ username }: Params) => {
    return useQuery({
        queryKey: ['watchStats', username],
        queryFn: () => getWatchStats({ params: { username } }),
    });
};

export default useWatchStats;
