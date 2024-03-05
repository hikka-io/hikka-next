import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import getFavourite from '@/services/api/favourite/getFavourite';
import addFavourite from '@/services/api/favourite/addFavourite';

const useAddFavorite = (slug: string, secret?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToFavorite', secret, slug],
        mutationFn: () =>
            addFavourite({
                secret: String(secret),
                slug: String(slug),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['favorite'] });
        },
    });
};

export default useAddFavorite;
