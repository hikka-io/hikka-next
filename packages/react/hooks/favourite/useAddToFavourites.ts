import { FavouriteContentTypeEnum, FavouriteResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type AddToFavouritesVariables = {
    contentType: FavouriteContentTypeEnum;
    slug: string;
};

/**
 * Hook for adding content to favourites
 */
export function useAddToFavourites(
    options?: Omit<
        UseMutationOptions<FavouriteResponse, Error, AddToFavouritesVariables>,
        'mutationFn'
    >,
): UseMutationResult<FavouriteResponse, Error, AddToFavouritesVariables> {
    return createMutation<FavouriteResponse, Error, AddToFavouritesVariables>(
        (client, { contentType, slug }) =>
            client.favourite.add(contentType, slug),
        (variables) => [
            // Invalidate the specific favourite status
            queryKeys.favourite.get(variables.contentType, variables.slug),
            // Invalidate favourite lists in general
            queryKeys.favourite.list(variables.contentType, ''),
        ],
    )(options);
}
