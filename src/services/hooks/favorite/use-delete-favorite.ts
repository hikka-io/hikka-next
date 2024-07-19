import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteFavourite, {
    Params,
} from '@/services/api/favourite/deleteFavourite';

const useDeleteFavorite = ({ slug, content_type }: Params) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteFromFavorite', slug, { content_type }],
        mutationFn: () =>
            deleteFavourite({
                params: {
                    slug,
                    content_type,
                },
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['favorite'] });
        },
    });
};

export default useDeleteFavorite;
