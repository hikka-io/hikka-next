import { useQuery } from '@tanstack/react-query';

import getRead, { Params } from '@/services/api/read/getRead';

const useRead = (
    { slug, content_type }: Params,
    options?: Hikka.QueryOptions,
) => {
    return useQuery({
        queryKey: ['read', slug, content_type],
        queryFn: () => getRead({ params: { slug, content_type } }),
        ...options,
    });
};

export default useRead;
