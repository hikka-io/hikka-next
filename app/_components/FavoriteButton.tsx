'use client';

import Favorite from '@/app/_components/icons/Favorite';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import addFavourite from '@/utils/api/favourite/addFavourite';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import getFavourite from '@/utils/api/favourite/getFavourite';
import deleteFavourite from '@/utils/api/favourite/deleteFavourite';
import FavoriteOutline from '@/app/_components/icons/FavoriteOutline';
import clsx from 'clsx';

interface Props {
    slug: string;
}

const Component = ({ slug }: Props) => {
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
        <button
            onClick={() =>
                favorite && !favoriteError
                    ? deleteFromFavorite()
                    : addToFavorite()
            }
            className={clsx(
                'btn btn-square btn-outline btn-md text-xl',
                (favorite && !favoriteError) ? 'btn-error bg-secondary' : 'btn-neutral',
            )}
        >
            {favorite && !favoriteError ? <Favorite /> : <FavoriteOutline />}
        </button>
    );
};

export default Component;
