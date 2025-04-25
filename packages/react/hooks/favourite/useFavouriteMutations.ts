import { FavouriteContentType } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

type FavouriteVariables = {
    contentType: FavouriteContentType;
    slug: string;
};

/**
 * Hook for adding to favourites
 */
export const useCreateFavourite = createMutation({
    mutationFn: (client, { contentType, slug }: FavouriteVariables) =>
        client.favourite.createFavourite(contentType, slug),
    invalidateQueries: ({ contentType, slug }) => [
        queryKeys.favourite.status(contentType, slug),
    ],
});

/**
 * Hook for removing from favourites
 */
export const useDeleteFavourite = createMutation({
    mutationFn: (client, { contentType, slug }: FavouriteVariables) =>
        client.favourite.deleteFavourite(contentType, slug),
    invalidateQueries: ({ contentType, slug }) => [
        queryKeys.favourite.status(contentType, slug),
    ],
});
