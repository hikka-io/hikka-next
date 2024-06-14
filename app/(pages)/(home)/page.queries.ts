import { QueryClient } from '@tanstack/query-core';

import getCollections from '@/services/api/collections/getCollections';
import getLatestComments from '@/services/api/comments/getLatestComments';
import getFollowingHistory from '@/services/api/history/getFollowingHistory';
import getAnimeSchedule from '@/services/api/stats/getAnimeSchedule';
import { prefetchWatchList } from '@/services/hooks/watch/use-watch-list';
import getCurrentSeason from '@/utils/get-current-season';

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
            prefetchWatchList({
                username: loggedUser.username,
                watch_status: 'watching',
            }),
        );

        promises.push(
            queryClient.prefetchInfiniteQuery({
                initialPageParam: 1,
                queryKey: ['followingHistory'],
                queryFn: ({ pageParam }) =>
                    getFollowingHistory({
                        page: pageParam,
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
