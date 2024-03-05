import { useQuery } from '@tanstack/react-query';

import getFavourite from '@/services/api/favourite/getFavourite';

const useFavorite = (slug: string, secret?: string) => {
    return useQuery({
        queryKey: ['favorite', slug, { secret }],
        queryFn: () =>
            getFavourite({ slug: String(slug), secret: String(secret) }),
        enabled: Boolean(secret),
    });
};

export default useFavorite;
