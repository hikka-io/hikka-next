import { useQuery } from '@tanstack/react-query';

import getCollections from '@/services/api/collections/getCollections';
import { useAuthContext } from '@/services/providers/auth-provider';

const useCollections = ({
    page,
    size,
    enabled = true,
}: {
    page?: number;
    size?: number;
    enabled?: boolean;
}) => {
    const { secret } = useAuthContext();

    return useQuery({
        queryKey: ['collections', { page, size, secret }],
        queryFn: () => getCollections({ page, size, secret }),
        enabled: enabled,
    });
};

export default useCollections;
