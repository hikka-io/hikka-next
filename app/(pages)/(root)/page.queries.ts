import { QueryClient } from '@tanstack/query-core';

import getCollections from '@/services/api/collections/getCollections';
import getLatestComments from '@/services/api/comments/getLatestComments';
import getFollowingHistory from '@/services/api/history/getFollowingHistory';
import getAnimeSchedule from '@/services/api/stats/getAnimeSchedule';
import getWatchList from '@/services/api/watch/getWatchList';
import getCurrentSeason from '@/utils/getCurrentSeason';

interface Props {
    queryClient: QueryClient;
}

const prefetchQueries = async ({ queryClient }: Props) => {
    const season = getCurrentSeason()!;

    const loggedUser: API.User | undefined = queryClient.getQueryData([
        'loggedUser',
    ]);

    const promises = [];

    if (loggedUser) {
        promises.push(
            queryClient.prefetchInfiniteQuery({
                initialPageParam: 1,
                queryKey: [
                    'watchList',
                    loggedUser.username,
                    {
                        ageRatings: [],
                        genres: [],
                        order: 'desc',
                        seasons: [],
                        sort: 'watch_score',
                        statuses: [],
                        types: [],
                        watch_status: 'watching',
                        years: [],
                    },
                ],
                queryFn: ({ pageParam = 1, meta }) =>
                    getWatchList({
                        params: {
                            username: loggedUser.username,
                            genres: [],
                            media_type: [],
                            rating: [],
                            season: [],
                            sort: ['watch_score:desc'],
                            status: [],
                            watch_status: 'watching',
                        },
                        page: pageParam,
                        auth: meta?.auth,
                    }),
            }),
        );

        promises.push(
            queryClient.prefetchInfiniteQuery({
                initialPageParam: 1,
                queryKey: ['followingHistory'],
                queryFn: ({ pageParam, meta }) =>
                    getFollowingHistory({
                        page: pageParam,
                        auth: meta?.auth,
                    }),
            }),
        );
    }

    promises.push(
        queryClient.prefetchInfiniteQuery({
            initialPageParam: 1,
            queryKey: [
                'animeSchedule',
                {
                    season,
                    status: ['ongoing', 'announced'],
                    year: String(new Date().getFullYear()),
                },
            ],
            queryFn: ({ pageParam = 1 }) =>
                getAnimeSchedule({
                    params: {
                        airing_season: [
                            season,
                            String(new Date().getFullYear()),
                        ],
                        status: ['ongoing', 'announced'],
                    },
                    page: pageParam,
                }),
        }),
    );

    promises.push(
        queryClient.prefetchQuery({
            queryKey: ['collections', { page: 1, sort: 'created' }],
            queryFn: () =>
                getCollections({ page: 1, params: { sort: 'created' } }),
        }),
    );

    promises.push(
        queryClient.prefetchQuery({
            queryKey: ['latestComments'],
            queryFn: () => getLatestComments(),
        }),
    );

    await Promise.all(promises);
};

export default prefetchQueries;
