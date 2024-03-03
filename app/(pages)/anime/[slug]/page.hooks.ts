import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import getAnimeCharacters from '@/services/api/anime/getAnimeCharacters';
import getAnimeFranchise from '@/services/api/anime/getAnimeFranchise';
import getAnimeStaff from '@/services/api/anime/getAnimeStaff';
import addWatch from '@/services/api/watch/addWatch';
import getWatch from '@/services/api/watch/getWatch';
import useInfiniteList from '@/services/hooks/useInfiniteList';

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
        queryKey: ['franchise', slug, { secret }],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeFranchise({
                slug: String(slug),
                page: pageParam,
                secret: String(secret),
            }),
        enabled: Boolean(secret),
    });
};

export const useStaff = (slug: string) => {
    return useInfiniteList({
        queryKey: ['staff', slug],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeStaff({ slug: slug, page: pageParam }),
    });
};

export const useWatch = (slug: string, secret?: string) => {
    return useQuery({
        queryKey: ['watch', slug, { secret }],
        queryFn: () => getWatch({ slug: slug, secret: String(secret) }),
        enabled: Boolean(secret),
    });
};

export const useAddToList = (slug: string, secret: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToList', slug, { secret }],
        mutationFn: (mutationParams: {
            status: API.WatchStatus;
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