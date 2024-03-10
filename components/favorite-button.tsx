'use client';

import clsx from 'clsx';
import MaterialSymbolsFavoriteOutlineRounded from '~icons/material-symbols/favorite-outline-rounded';
import MaterialSymbolsFavoriteRounded from '~icons/material-symbols/favorite-rounded';

import { Button, ButtonProps } from '@/components/ui/button';
import useAddFavorite from '@/services/hooks/favorite/useAddFavorite';
import useDeleteFavorite from '@/services/hooks/favorite/useDeleteFavorite';
import useFavorite from '@/services/hooks/favorite/useFavorite';

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
        <Button
            variant="ghost"
            size="icon-md"
            disabled={disabled}
            onClick={() =>
                favorite && !favoriteError
                    ? deleteFromFavorite()
                    : addToFavorite()
            }
            className={clsx('absolute bottom-2 right-2 z-[1]')}
            {...props}
        >
            {favorite && !favoriteError ? (
                <MaterialSymbolsFavoriteRounded className="text-xl text-destructive" />
            ) : (
                <MaterialSymbolsFavoriteOutlineRounded className="text-xl text-white" />
            )}
            {children}
        </Button>
    );
};

export default Component;
