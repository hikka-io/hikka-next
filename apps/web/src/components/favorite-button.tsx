'use client';

import { FavouriteContentType } from '@hikka/client';
import {
    useCreateFavourite,
    useDeleteFavourite,
    useFavouriteStatus,
} from '@hikka/react';

import { Button, ButtonProps } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { MaterialSymbolsFavoriteOutlineRounded } from './icons/material-symbols/MaterialSymbolsFavoriteOutlineRounded';
import { MaterialSymbolsFavoriteRounded } from './icons/material-symbols/MaterialSymbolsFavoriteRounded';

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
        useCreateFavourite();

    const { mutate: deleteFromFavorite, isPending: deleteFromFavoriteLoading } =
        useDeleteFavourite();

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
                        <MaterialSymbolsFavoriteRounded className="!size-5 text-red-500" />
                    ) : (
                        <MaterialSymbolsFavoriteOutlineRounded className="!size-5 text-foreground" />
                    )}
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>В улюблене</TooltipContent>
        </Tooltip>
    );
};

export default Component;
