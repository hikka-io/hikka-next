'use client';

import useAddFavorite from '../services/hooks/favorite/use-add-favorite';
import useDeleteFavorite from '../services/hooks/favorite/use-delete-favorite';
import useFavorite from '../services/hooks/favorite/use-favorite';
import { MaterialSymbolsFavoriteOutlineRounded } from './icons/material-symbols/MaterialSymbolsFavoriteOutlineRounded';
import { MaterialSymbolsFavoriteRounded } from './icons/material-symbols/MaterialSymbolsFavoriteRounded';
import { Button, ButtonProps } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface Props extends ButtonProps {
    slug: string;
    disabled?: boolean;
    content_type: API.ContentType;
}

const Component = ({
    slug,
    content_type,
    disabled,
    children,
    ...props
}: Props) => {
    const { data: favorite, isError: favoriteError } = useFavorite({
        slug,
        content_type,
    });

    const { mutate: addToFavorite, isPending: addToFavoriteLoading } =
        useAddFavorite({ slug, content_type });

    const { mutate: deleteFromFavorite, isPending: deleteFromFavoriteLoading } =
        useDeleteFavorite({ slug, content_type });

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-md"
                    disabled={disabled}
                    onClick={() =>
                        favorite && !favoriteError
                            ? deleteFromFavorite()
                            : addToFavorite()
                    }
                    {...props}
                >
                    {favorite && !favoriteError ? (
                        <MaterialSymbolsFavoriteRounded className="!size-5 text-destructive" />
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
