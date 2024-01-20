'use client';

import clsx from 'clsx';
import MaterialSymbolsFavoriteOutlineRounded from '~icons/material-symbols/favorite-outline-rounded';
import MaterialSymbolsFavoriteRounded from '~icons/material-symbols/favorite-rounded';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import addFavourite from '@/utils/api/favourite/addFavourite';
import deleteFavourite from '@/utils/api/favourite/deleteFavourite';
import getFavourite from '@/utils/api/favourite/getFavourite';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { Button } from '@/app/_components/ui/button';

interface Props {
    slug: string;
    disabled?: boolean;
}

const Component = ({ slug, disabled }: Props) => {
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();

    const { data: favorite, isError: favoriteError } = useQuery({
        queryKey: ['favorite', secret, slug],
        queryFn: () =>
            getFavourite({ slug: String(slug), secret: String(secret) }),
    });

    const { mutate: addToFavorite, isLoading: addToFavoriteLoading } =
        useMutation({
            mutationKey: ['addToFavorite', secret, slug],
            mutationFn: () =>
                addFavourite({
                    secret: String(secret),
                    slug: String(slug),
                }),
            onSuccess: async () => {
                await queryClient.invalidateQueries(['favorite']);
            },
        });

    const { mutate: deleteFromFavorite, isLoading: deleteFromFavoriteLoading } =
        useMutation({
            mutationKey: ['deleteFromFavorite', secret, slug],
            mutationFn: () =>
                deleteFavourite({
                    secret: String(secret),
                    slug: String(slug),
                }),
            onSuccess: async () => {
                await queryClient.invalidateQueries(['favorite']);
            },
        });

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
            className={clsx(
                'absolute bottom-2 right-2 z-[1]',
            )}
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