'use client';

import clsx from 'clsx';
import MaterialSymbolsFavoriteOutlineRounded from '~icons/material-symbols/favorite-outline-rounded';
import MaterialSymbolsFavoriteRounded from '~icons/material-symbols/favorite-rounded';

import { Button } from '@/components/ui/button';
import useAddFavorite from '@/services/hooks/favorite/useAddFavorite';
import useDeleteFavorite from '@/services/hooks/favorite/useDeleteFavorite';
import useFavorite from '@/services/hooks/favorite/useFavorite';
import { useAuthContext } from '@/services/providers/auth-provider';

interface Props {
    slug: string;
    disabled?: boolean;
}

const Component = ({ slug, disabled }: Props) => {
    const { secret } = useAuthContext();

    const { data: favorite, isError: favoriteError } = useFavorite(
        slug,
        secret,
    );

    const { mutate: addToFavorite, isPending: addToFavoriteLoading } =
        useAddFavorite(slug, secret);

    const { mutate: deleteFromFavorite, isPending: deleteFromFavoriteLoading } =
        useDeleteFavorite(slug, secret);

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
        >
            {favorite && !favoriteError ? (
                <MaterialSymbolsFavoriteRounded className="text-xl text-destructive" />
            ) : (
                <MaterialSymbolsFavoriteOutlineRounded className="text-xl text-white" />
            )}
        </Button>
    );
};

export default Component;
