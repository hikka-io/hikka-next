import getAnimeCharacters from '@/services/api/anime/getAnimeCharacters';
import getAnimeFranchise from '@/services/api/anime/getAnimeFranchise';
import getAnimeStaff from '@/services/api/anime/getAnimeStaff';
import getWatch from '@/services/api/watch/getWatch';
import getFavourite from '@/services/api/favourite/getFavourite';
import getFollowingWatchList from '@/services/api/watch/getFollowingWatchList';
import { QueryClient } from '@tanstack/query-core';

interface Props {
    queryClient: QueryClient
    params: {
        slug: string;
    }
}

const prefetchQueries = async ({ queryClient, params: { slug } }: Props) => {
    const auth = queryClient.getDefaultOptions().queries?.meta?.auth;

    await Promise.all([
        queryClient.prefetchInfiniteQuery({
            queryKey: ['characters', slug],
            queryFn: ({ pageParam = 1, meta }) =>
                getAnimeCharacters({
                    params: { slug },
                    page: pageParam,
                    auth: meta?.auth,
                }),
            initialPageParam: 1,
        }),
        queryClient.prefetchInfiniteQuery({
            queryKey: ['franchise', slug],
            queryFn: ({ pageParam = 1, meta }) =>
                getAnimeFranchise({
                    params: { slug },
                    page: pageParam,
                    auth: meta?.auth,
                }),
            initialPageParam: 1,
        }),
        queryClient.prefetchInfiniteQuery({
            queryKey: ['staff', slug],
            queryFn: ({ pageParam = 1, meta }) =>
                getAnimeStaff({
                    params: { slug },
                    page: pageParam,
                    auth: meta?.auth,
                }),
            initialPageParam: 1,
        }),
        auth
            ? queryClient.prefetchQuery({
                queryKey: ['watch', slug],
                queryFn: ({ meta }) =>
                    getWatch({ params: { slug }, auth: meta?.auth }),
            })
            : undefined,
        auth
            ? queryClient.prefetchQuery({
                queryKey: ['favorite', slug, { content_type: 'anime' }],
                queryFn: ({ meta }) =>
                    getFavourite({
                        params: {
                            slug: String(slug),
                            content_type: 'anime',
                        },
                        auth: meta?.auth,
                    }),
            })
            : undefined,
        auth
            ? queryClient.prefetchInfiniteQuery({
                initialPageParam: 1,
                queryKey: ['followingWatchList', slug],
                queryFn: ({ pageParam = 1, meta }) =>
                    getFollowingWatchList({
                        params: {
                            slug: slug,
                        },
                        page: pageParam,
                        auth: meta?.auth,
                    }),
            })
            : undefined,
    ]);
}

export default prefetchQueries;