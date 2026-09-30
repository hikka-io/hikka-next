import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    type FavouriteContentTypeEnum,
    favouriteAddMutation,
    favouriteDeleteMutation,
} from '@hikka/api';

import { MaterialSymbolsFavoriteOutlineRounded } from '@/components/icons/material-symbols/MaterialSymbolsFavoriteOutlineRounded';
import { MaterialSymbolsFavoriteRounded } from '@/components/icons/material-symbols/MaterialSymbolsFavoriteRounded';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { favouriteEntryOptions } from '@/utils/api/content-queries';
import {
    applyFavouriteDeletion,
    applyFavouriteMutation,
} from '@/utils/api/invalidate-content-state';

type Props = ButtonProps & {
    slug: string;
    disabled?: boolean;
    content_type: FavouriteContentTypeEnum;
};

const FavoriteButton = ({
    slug,
    content_type,
    disabled,
    children,
    ...props
}: Props) => {
    const queryClient = useQueryClient();

    const { data: favorite, isError: favoriteError } = useQuery({
        ...favouriteEntryOptions(content_type, slug),
        retry: false,
        // Logged-out users (disabled) would just 401 on this authenticated query.
        enabled: !disabled,
    });

    const { mutate: addToFavorite, isPending: addToFavoriteLoading } =
        useMutation({
            ...favouriteAddMutation(),
            onSuccess: (data) =>
                applyFavouriteMutation(queryClient, content_type, slug, data),
        });

    const { mutate: deleteFromFavorite, isPending: deleteFromFavoriteLoading } =
        useMutation({
            ...favouriteDeleteMutation(),
            onSuccess: () =>
                applyFavouriteDeletion(queryClient, content_type, slug),
        });

    const isFavorite = Boolean(favorite);
    const favoriteUnreadable = favorite === undefined && favoriteError;

    return (
        <Tooltip delay={0}>
            <TooltipTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-md"
                        disabled={
                            disabled ||
                            favoriteUnreadable ||
                            addToFavoriteLoading ||
                            deleteFromFavoriteLoading
                        }
                        onClick={() =>
                            isFavorite
                                ? deleteFromFavorite({
                                      path: { content_type, slug },
                                  })
                                : addToFavorite({
                                      path: { content_type, slug },
                                  })
                        }
                        {...props}
                    />
                }
            >
                {isFavorite ? (
                    <MaterialSymbolsFavoriteRounded className="size-5! text-red-500" />
                ) : (
                    <MaterialSymbolsFavoriteOutlineRounded className="size-5! text-foreground" />
                )}
                {children}
            </TooltipTrigger>
            <TooltipContent>В улюблене</TooltipContent>
        </Tooltip>
    );
};

export default FavoriteButton;
