'use client';

import { FavouriteContentType } from '@hikka/client';
import {
    useAddFavourite,
    useFavouriteStatus,
    useRemoveFavourite,
} from '@hikka/react';

import { MaterialSymbolsFavoriteOutlineRounded } from './icons/material-symbols/MaterialSymbolsFavoriteOutlineRounded';
import { MaterialSymbolsFavoriteRounded } from './icons/material-symbols/MaterialSymbolsFavoriteRounded';
import { Button, ButtonProps } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface Props extends ButtonProps {
    slug: string;
    disabled?: boolean;
    content_type: FavouriteContentType;
}

const Component = ({
    slug,
    content_type,
    disabled,
    children,
    ...props
}: Props) => {
    const { data: favorite, isError: favoriteError } = useFavouriteStatus({
        slug,
        contentType: content_type,
    });

    const { mutate: addToFavorite, isPending: addToFavoriteLoading } =
        useAddFavourite();

    const { mutate: deleteFromFavorite, isPending: deleteFromFavoriteLoading } =
        useRemoveFavourite();

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-md"
                    disabled={disabled}
                    onClick={() =>
                        favorite && !favoriteError
                            ? deleteFromFavorite({
                                  contentType: content_type,
                                  slug,
                              })
                            : addToFavorite({ contentType: content_type, slug })
                    }
                    {...props}
                >
                    {favorite && !favoriteError ? (
                        <MaterialSymbolsFavoriteRounded className="text-destructive !size-5" />
                    ) : (
                        <MaterialSymbolsFavoriteOutlineRounded className="text-foreground !size-5" />
                    )}
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>В улюблене</TooltipContent>
        </Tooltip>
    );
};

export default Component;
