import { useMutation, useQueryClient } from '@tanstack/react-query';

import addFavourite from '@/services/api/favourite/addFavourite';
import useAuth from '@/services/hooks/auth/useAuth';

const useAddFavorite = ({
    slug,
    content_type,
}: {
    slug: string;
    content_type: API.ContentType;
}) => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToFavorite', slug, { auth, content_type }],
        mutationFn: () =>
            addFavourite({
                auth: auth!,
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
