import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import getAnimeCharacters from '@/app/_utils/api/anime/getAnimeCharacters';
import getAnimeFranchise from '@/app/_utils/api/anime/getAnimeFranchise';
import getAnimeInfo from '@/app/_utils/api/anime/getAnimeInfo';
import getAnimeStaff from '@/app/_utils/api/anime/getAnimeStaff';
import addWatch from '@/app/_utils/api/watch/addWatch';
import getWatch from '@/app/_utils/api/watch/getWatch';
import useInfiniteList from '@/app/_utils/hooks/useInfiniteList';

export const useAnimeInfo = (slug: string) => {
    return useQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug }),
    });
};

export const useCharacters = (slug: string) => {
    return useInfiniteList({
        queryKey: ['characters', slug],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeCharacters({
                slug: String(slug),
                page: pageParam,
            }),
    });
};

export const useFranchise = (slug: string, secret?: string) => {
    return useInfiniteList({
        queryKey: ['franchise', slug, secret],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeFranchise({
                slug: String(slug),
                page: pageParam,
                secret: String(secret),
            }),
    });
};

export const useStaff = (slug: string) => {
    return useInfiniteList({
        queryKey: ['staff', slug],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeStaff({ slug: slug, page: pageParam }),
    });
};

export const useWatch = (slug: string, secret: string) => {
    return useQuery({
        queryKey: ['watch', slug, secret],
        queryFn: () => getWatch({ slug: slug, secret: secret }),
    });
};

export const useAddToList = (slug: string, secret: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToList', secret, slug],
        mutationFn: (mutationParams: {
            status: Hikka.WatchStatus;
            score: number;
            episodes: number;
        }) =>
            addWatch({
                secret: secret,
                slug: slug,
                ...mutationParams,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['watch'] });
        },
    });
};