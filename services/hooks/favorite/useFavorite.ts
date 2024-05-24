import { useQuery } from '@tanstack/react-query';

import getFavourite, { Params } from '@/services/api/favourite/getFavourite';

const useFavorite = ({ slug, content_type }: Params) => {
    return useQuery({
        queryKey: ['favorite', slug, { content_type }],
        queryFn: () => getFavourite({ params: { slug, content_type } }),
    });
};

export default useFavorite;
