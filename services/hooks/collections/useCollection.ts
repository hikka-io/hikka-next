import { useQuery } from '@tanstack/react-query';

import getCollection from '@/services/api/collections/getCollection';
import { useAuthContext } from '@/services/providers/auth-provider';

const useCollection = ({
    reference,
    enabled = true,
}: {
    reference: string;
    enabled?: boolean;
}) => {
    const { secret } = useAuthContext();

    return useQuery({
        queryKey: ['collection', reference, { secret }],
        queryFn: () => getCollection({ reference: reference, secret }),
        enabled: enabled,
        staleTime: 0,
    });
};

export default useCollection;
