import { FavouriteContentTypeEnum, SuccessResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type RemoveFromFavouritesVariables = {
    contentType: FavouriteContentTypeEnum;
    slug: string;
};

/**
 * Hook for removing content from favourites
 */
export function useRemoveFromFavourites(
    options?: Omit<
        UseMutationOptions<
            SuccessResponse,
            Error,
            RemoveFromFavouritesVariables
        >,
        'mutationFn'
    >,
): UseMutationResult<SuccessResponse, Error, RemoveFromFavouritesVariables> {
    return createMutation<
        SuccessResponse,
        Error,
        RemoveFromFavouritesVariables
    >(
        (client, { contentType, slug }) =>
            client.favourite.remove(contentType, slug),
        (variables) => [
            // Invalidate the specific favourite status
            queryKeys.favourite.get(variables.contentType, variables.slug),
            // Invalidate favourite lists in general
            queryKeys.favourite.list(variables.contentType, ''),
        ],
    )(options);
}
