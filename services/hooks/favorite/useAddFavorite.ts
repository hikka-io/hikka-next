import { useMutation, useQueryClient } from '@tanstack/react-query';

import addFavourite from '@/services/api/favourite/addFavourite';
import { useAuthContext } from '@/services/providers/auth-provider';

const useAddFavorite = ({ slug }: { slug: string }) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToFavorite', slug, { secret }],
        mutationFn: () =>
            addFavourite({
                secret: secret!,
                slug: slug,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['favorite'] });
        },
    });
};

export default useAddFavorite;
