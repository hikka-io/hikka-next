import { useQuery } from '@tanstack/react-query';

import getWatch from '@/services/api/watch/getWatch';
import { useAuthContext } from '@/services/providers/auth-provider';

const useWatch = ({
    slug,
    enabled = true,
}: {
    slug: string;
    enabled?: boolean;
}) => {
    const { secret } = useAuthContext();

    return useQuery({
        queryKey: ['watch', slug, { secret }],
        queryFn: () => getWatch({ slug: slug, secret: secret! }),
        enabled: enabled || Boolean(secret),
    });
};

export default useWatch;
