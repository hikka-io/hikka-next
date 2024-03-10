import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteFavourite from '@/services/api/favourite/deleteFavourite';
import { useAuthContext } from '@/services/providers/auth-provider';

const useDeleteFavorite = ({
    slug,
    content_type,
}: {
    slug: string;
    content_type: API.ContentType;
}) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteFromFavorite', slug, { secret, content_type }],
        mutationFn: () =>
            deleteFavourite({
                secret: secret!,
                slug: slug,
                content_type: content_type,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['favorite'] });
        },
    });
};

export default useDeleteFavorite;
