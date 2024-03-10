import { useQuery } from '@tanstack/react-query';

import getFavourite from '@/services/api/favourite/getFavourite';
import { useAuthContext } from '@/services/providers/auth-provider';

const useFavorite = ({ slug, content_type }: { slug: string; content_type: API.ContentType }) => {
    const { secret } = useAuthContext();

    return useQuery({
        queryKey: ['favorite', slug, { secret, content_type }],
        queryFn: () => getFavourite({ slug: slug, secret: secret!, content_type }),
        enabled: Boolean(secret),
    });
};

export default useFavorite;
