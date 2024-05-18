import { QueryClient } from '@tanstack/query-core';

import getAnimeCharacters from '@/services/api/anime/getAnimeCharacters';
import getAnimeFranchise from '@/services/api/anime/getAnimeFranchise';
import getAnimeStaff from '@/services/api/anime/getAnimeStaff';
import getFavourite from '@/services/api/favourite/getFavourite';
import getFollowingWatchList from '@/services/api/watch/getFollowingWatchList';
import getWatch from '@/services/api/watch/getWatch';
import { getCookie } from '@/utils/cookies';

interface Props {
    queryClient: QueryClient;
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ queryClient, params: { slug } }: Props) => {
    const auth = await getCookie('auth');

    await Promise.all([
        queryClient.prefetchInfiniteQuery({
            queryKey: ['characters', slug],
            queryFn: ({ pageParam = 1 }) =>
                getAnimeCharacters({
                    params: { slug },
                    page: pageParam,
                }),
            initialPageParam: 1,
        }),
        queryClient.prefetchInfiniteQuery({
            queryKey: ['franchise', slug],
            queryFn: ({ pageParam = 1, meta }) =>
                getAnimeFranchise({
                    params: { slug },
                    page: pageParam,
                }),
            initialPageParam: 1,
        }),
        queryClient.prefetchInfiniteQuery({
            queryKey: ['staff', slug],
            queryFn: ({ pageParam = 1, meta }) =>
                getAnimeStaff({
                    params: { slug },
                    page: pageParam,
                }),
            initialPageParam: 1,
        }),
        auth
            ? queryClient.prefetchQuery({
                  queryKey: ['watch', slug],
                  queryFn: ({ meta }) => getWatch({ params: { slug } }),
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
                      }),
              })
            : undefined,
    ]);
};

export default prefetchQueries;
