import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteFavourite from '@/services/api/favourite/deleteFavourite';
import { useAuthContext } from '@/services/providers/auth-provider';

const useDeleteFavorite = ({ slug }: { slug: string }) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteFromFavorite', slug, { secret }],
        mutationFn: () =>
            deleteFavourite({
                secret: secret!,
                slug: slug,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['favorite'] });
        },
    });
};

export default useDeleteFavorite;
