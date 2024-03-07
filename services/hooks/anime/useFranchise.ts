import getAnimeFranchise from '@/services/api/anime/getAnimeFranchise';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useAuthContext } from '@/services/providers/auth-provider';

const useFranchise = ({ slug }: { slug: string }) => {
    const { secret } = useAuthContext();

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
