import { useQuery } from '@tanstack/react-query';

import getCollections, {
    Params,
} from '@/services/api/collections/getCollections';

const useCollections = (
    { page, sort = 'system_ranking' }: Params,
    options?: Hikka.QueryOptions,
) => {
    return useQuery({
        queryKey: ['collections', { page, sort }],
        queryFn: () => getCollections({ page, params: { sort } }),
        ...options,
    });
};

export default useCollections;
