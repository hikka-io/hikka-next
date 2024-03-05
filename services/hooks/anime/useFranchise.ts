import getAnimeFranchise from '@/services/api/anime/getAnimeFranchise';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useFranchise = (slug: string, secret?: string) => {
    return useInfiniteList({
        queryKey: ['franchise', slug, { secret }],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeFranchise({
                slug: String(slug),
                page: pageParam,
                secret: String(secret),
            }),
        enabled: Boolean(secret),
    });
};

export default useFranchise;
