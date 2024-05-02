import { useQuery } from '@tanstack/react-query';

import getCollection from '@/services/api/collections/getCollection';

const useCollection = ({
    reference,
    enabled = true,
}: {
    reference: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['collection', reference],
        queryFn: () => getCollection({ params: { reference } }),
        enabled: enabled,
        staleTime: 0,
    });
};

export default useCollection;
