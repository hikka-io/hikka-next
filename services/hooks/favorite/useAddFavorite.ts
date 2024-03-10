import { useMutation, useQueryClient } from '@tanstack/react-query';

import addFavourite from '@/services/api/favourite/addFavourite';
import { useAuthContext } from '@/services/providers/auth-provider';

const useAddFavorite = ({
    slug,
    content_type,
}: {
    slug: string;
    content_type: API.ContentType;
}) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToFavorite', slug, { secret, content_type }],
        mutationFn: () =>
            addFavourite({
                secret: secret!,
                slug: slug,
                content_type,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['favorite'],
                exact: false,
            });
        },
    });
};

export default useAddFavorite;
