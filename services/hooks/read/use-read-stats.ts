import { useQuery } from '@tanstack/react-query';

import getReadStats, { Params } from '@/services/api/read/getReadStats';

const useReadStats = ({ username, content_type }: Params) => {
    return useQuery({
        queryKey: ['read-stats', username, content_type],
        queryFn: () => getReadStats({ params: { username, content_type } }),
    });
};

export default useReadStats;
