import { useQuery } from '@tanstack/react-query';

import getCollections from '@/services/api/collections/getCollections';

const useCollections = ({
    page,
    sort = 'system_ranking',
    enabled = true,
}: {
    page?: number;
    enabled?: boolean;
    sort: 'system_ranking' | 'created';
}) => {
    return useQuery({
        queryKey: ['collections', { page, sort }],
        queryFn: () => getCollections({ page, params: { sort } }),
        enabled: enabled,
    });
};

export default useCollections;
