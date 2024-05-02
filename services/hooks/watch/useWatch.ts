import { useQuery } from '@tanstack/react-query';

import getWatch from '@/services/api/watch/getWatch';

const useWatch = ({
    slug,
    enabled = true,
}: {
    slug: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['watch', slug],
        queryFn: () => getWatch({ params: { slug } }),
        enabled: enabled,
    });
};

export default useWatch;
