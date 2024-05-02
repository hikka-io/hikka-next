import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteFavourite from '@/services/api/favourite/deleteFavourite';

const useDeleteFavorite = ({
    slug,
    content_type,
}: {
    slug: string;
    content_type: API.ContentType;
}) => {
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
