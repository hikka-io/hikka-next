import { useQuery } from '@tanstack/react-query';



import getFavourite from '@/services/api/favourite/getFavourite';


import useAuth from '../auth/useAuth';


const useFavorite = ({ slug, content_type }: { slug: string; content_type: API.ContentType }) => {
    const { auth } = useAuth();

    return useQuery({
        queryKey: ['favorite', slug, { auth, content_type }],
        queryFn: () => getFavourite({ slug: slug, auth: auth!, content_type }),
        enabled: Boolean(auth),
    });
};

export default useFavorite;
