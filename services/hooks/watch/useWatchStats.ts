import { useQuery } from '@tanstack/react-query';

import getWatchStats from '@/services/api/watch/getWatchStats';

const useWatchStats = (username: string) => {
    return useQuery({
        queryKey: ['watchStats', username],
        queryFn: () => getWatchStats({ username: username }),
    });
};

export default useWatchStats;
