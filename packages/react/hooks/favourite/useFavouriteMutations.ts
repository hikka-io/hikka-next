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
export const useAddFavourite = createMutation({
    mutationFn: (client, { contentType, slug }: FavouriteVariables) =>
        client.favourite.add(contentType, slug),
    invalidateQueries: ({ contentType, slug }) => [
        queryKeys.favourite.status(contentType, slug),
    ],
});

/**
 * Hook for removing from favourites
 */
export const useRemoveFavourite = createMutation({
    mutationFn: (client, { contentType, slug }: FavouriteVariables) =>
        client.favourite.remove(contentType, slug),
    invalidateQueries: ({ contentType, slug }) => [
        queryKeys.favourite.status(contentType, slug),
    ],
});
