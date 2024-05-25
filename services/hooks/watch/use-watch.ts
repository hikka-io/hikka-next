import { useQuery } from '@tanstack/react-query';

import getWatch, { Params } from '@/services/api/watch/getWatch';

const useWatch = ({ slug }: Params, options?: Hikka.QueryOptions) => {
    return useQuery({
        queryKey: ['watch', slug],
        queryFn: () => getWatch({ params: { slug } }),
        ...options,
    });
};

export default useWatch;
