import { useQuery } from '@tanstack/react-query';

import getCollection, {
    Params,
} from '@/services/api/collections/getCollection';

const useCollection = ({ reference }: Params, options?: Hikka.QueryOptions) => {
    return useQuery({
        queryKey: ['collection', reference],
        queryFn: () => getCollection({ params: { reference } }),
        ...options,
    });
};

export default useCollection;
