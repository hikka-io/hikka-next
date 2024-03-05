import { useQuery } from '@tanstack/react-query';

import getWatch from '@/services/api/watch/getWatch';

const useWatch = (slug: string, secret?: string, enabled?: boolean) => {
    return useQuery({
        queryKey: ['watch', slug, { secret }],
        queryFn: () => getWatch({ slug: slug, secret: String(secret) }),
        enabled: enabled || Boolean(secret),
    });
};

export default useWatch;
