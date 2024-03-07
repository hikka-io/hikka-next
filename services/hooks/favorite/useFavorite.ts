import { useQuery } from '@tanstack/react-query';

import getFavourite from '@/services/api/favourite/getFavourite';
import { useAuthContext } from '@/services/providers/auth-provider';

const useFavorite = ({ slug }: { slug: string }) => {
    const { secret } = useAuthContext();

    return useQuery({
        queryKey: ['favorite', slug, { secret }],
        queryFn: () => getFavourite({ slug: slug, secret: secret! }),
        enabled: Boolean(secret),
    });
};

export default useFavorite;
