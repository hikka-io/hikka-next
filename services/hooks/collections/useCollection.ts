import { useQuery } from '@tanstack/react-query';

import getCollection from '@/services/api/collections/getCollection';

const useCollection = ({
    reference,
    secret,
    enabled = true,
}: {
    reference: string;
    secret?: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['collection', { reference: reference, secret }],
        queryFn: () => getCollection({ reference: reference, secret }),
        enabled: enabled,
    });
};

export default useCollection;
