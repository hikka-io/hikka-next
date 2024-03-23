import { useMutation, useQueryClient } from '@tanstack/react-query';



import deleteFavourite from '@/services/api/favourite/deleteFavourite';


import useAuth from '../auth/useAuth';


const useDeleteFavorite = ({
    slug,
    content_type,
}: {
    slug: string;
    content_type: API.ContentType;
}) => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteFromFavorite', slug, { auth, content_type }],
        mutationFn: () =>
            deleteFavourite({
                auth: auth!,
                slug: slug,
                content_type: content_type,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['favorite'] });
        },
    });
};

export default useDeleteFavorite;
