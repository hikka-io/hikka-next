import getAnimeFranchise from '@/services/api/anime/getAnimeFranchise';
import useInfiniteList from '@/services/hooks/useInfiniteList';

import useAuth from '../auth/useAuth';

const useFranchise = ({ slug }: { slug: string }) => {
    const { auth } = useAuth();

    return useInfiniteList({
        queryKey: ['franchise', slug, { auth }],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeFranchise({
                slug: String(slug),
                page: pageParam,
                auth: String(auth),
            }),
    });
};

export default useFranchise;
