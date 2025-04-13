import { useMutation, useQueryClient } from '@tanstack/react-query';

import addFavourite, { Params } from '../../api/favourite/addFavourite';

const useAddFavorite = ({ slug, content_type }: Params) => {
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
                queryKey: ['favorites'],
                exact: false,
            });
            await queryClient.invalidateQueries({
                queryKey: ['favorite'],
                exact: false,
            });
        },
    });
};

export default useAddFavorite;
