import { useQuery } from '@tanstack/react-query';

import getFavourite from '@/services/api/favourite/getFavourite';

const useFavorite = ({
    slug,
    content_type,
}: {
    slug: string;
    content_type: API.ContentType;
}) => {
    return useQuery({
        queryKey: ['favorite', slug, { content_type }],
        queryFn: () => getFavourite({ params: { slug, content_type } }),
    });
};

export default useFavorite;
