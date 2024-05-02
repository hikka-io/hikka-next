import { useQuery } from '@tanstack/react-query';

import getWatchStats from '@/services/api/watch/getWatchStats';

const useWatchStats = ({ username }: { username: string }) => {
    return useQuery({
        queryKey: ['watchStats', username],
        queryFn: () => getWatchStats({ params: { username } }),
    });
};

export default useWatchStats;
