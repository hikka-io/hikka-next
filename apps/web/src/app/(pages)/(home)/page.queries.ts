import {
    AnimeMediaEnum,
    ContentStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { QueryClient } from '@hikka/react/core';
import {
    prefetchFollowingHistory,
    prefetchLatestComments,
    prefetchSearchAnimeSchedule,
    prefetchSearchAnimes,
    prefetchSearchArticles,
    prefetchSearchCollections,
    prefetchSearchUserWatches,
    prefetchSession,
} from '@hikka/react/server';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';
import getCurrentSeason from '@/utils/season-utils';

const prefetchQueries = async ({
    queryClient,
}: {
    queryClient: QueryClient;
}) => {
    const clientConfig = await getHikkaClientConfig();
    const season = getCurrentSeason()!;
    const year = Number(new Date().getFullYear());

    const loggedUser = await prefetchSession({ clientConfig, queryClient });

    const promises = [];

    if (loggedUser) {
        promises.push(
            prefetchSearchUserWatches({
                username: loggedUser.username,
                args: {
                    watch_status: WatchStatusEnum.WATCHING,
                    sort: ['watch_updated:desc'],
                },
                clientConfig,
                queryClient,
            }),
        );

        promises.push(
            prefetchFollowingHistory({
                clientConfig,
                queryClient,
            }),
        );
    }

    promises.push(
        prefetchSearchAnimes({
            args: {
                season: [season!],
                score: [7, 10],
                years: [year, year],
                media_type: [AnimeMediaEnum.TV],
                sort: ['scored_by:desc', 'score:desc'],
            },
            paginationArgs: {
                size: 8,
            },
            clientConfig,
            queryClient,
        }),
    );

    promises.push(
        prefetchSearchAnimeSchedule({
            args: {
                airing_season: [season, Number(new Date().getFullYear())],
                status: [
                    ContentStatusEnum.ONGOING,
                    ContentStatusEnum.ANNOUNCED,
                ],
            },
            clientConfig,
            queryClient,
        }),
    );

    promises.push(
        prefetchSearchCollections({
            args: { sort: ['created:desc'] },
            paginationArgs: {
                size: 3,
            },
            clientConfig,
            queryClient,
        }),
    );

    promises.push(
        prefetchSearchArticles({
            args: { sort: ['created:desc'] },
            paginationArgs: {
                size: 3,
            },
            clientConfig,
            queryClient,
        }),
    );

    promises.push(prefetchLatestComments({ clientConfig, queryClient }));

    await Promise.all(promises);
};

export default prefetchQueries;
