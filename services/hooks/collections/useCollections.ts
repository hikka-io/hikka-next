import { useQuery } from '@tanstack/react-query';

import getCollections from '@/services/api/collections/getCollections';

import useAuth from '../auth/useAuth';

const useCollections = ({
    page,
    sort = 'system_ranking',
    enabled = true,
}: {
    page?: number;
    enabled?: boolean;
    sort: 'system_ranking' | 'created';
}) => {
    const { auth } = useAuth();

    return useQuery({
        queryKey: ['collections', { page, auth, sort }],
        queryFn: () => getCollections({ page, auth, sort }),
        enabled: enabled,
    });
};

export default useCollections;
