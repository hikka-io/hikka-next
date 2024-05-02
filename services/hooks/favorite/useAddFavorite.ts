import { useMutation, useQueryClient } from '@tanstack/react-query';

import addFavourite from '@/services/api/favourite/addFavourite';

const useAddFavorite = ({
    slug,
    content_type,
}: {
    slug: string;
    content_type: API.ContentType;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToFavorite', slug, { content_type }],
        mutationFn: () =>
            addFavourite({
                params: {
                    slug: slug,
                    content_type,
                },
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
