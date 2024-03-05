import { useQuery } from '@tanstack/react-query';

import getCollections from '@/services/api/collections/getCollections';

const useCollections = ({
    page,
    size,
    secret,
    enabled = true,
}: {
    page?: number;
    size?: number;
    secret?: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['collections', { page, size, secret }],
        queryFn: () => getCollections({ page, size, secret }),
        enabled: enabled,
    });
};

export default useCollections;
