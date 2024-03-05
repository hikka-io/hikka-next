import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import getFavourite from '@/services/api/favourite/getFavourite';
import addFavourite from '@/services/api/favourite/addFavourite';
import deleteFavourite from '@/services/api/favourite/deleteFavourite';

const useDeleteFavorite = (slug: string, secret?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteFromFavorite', secret, slug],
        mutationFn: () =>
            deleteFavourite({
                secret: String(secret),
                slug: String(slug),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['favorite'] });
        },
    });
};

export default useDeleteFavorite;
