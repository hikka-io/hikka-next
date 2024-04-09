import { useQuery } from '@tanstack/react-query';

import getWatch from '@/services/api/watch/getWatch';

import useAuth from '../auth/useAuth';

const useWatch = ({
    slug,
    enabled = true,
}: {
    slug: string;
    enabled?: boolean;
}) => {
    const { auth } = useAuth();

    return useQuery({
        queryKey: ['watch', slug, { auth }],
        queryFn: () => getWatch({ slug: slug, auth: auth! }),
        enabled: enabled || Boolean(auth),
    });
};

export default useWatch;
