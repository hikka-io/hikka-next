import { ContentStatusEnum, WatchStatusEnum } from '@hikka/client';
import { getQueryClient } from '@hikka/react/core';
import {
    prefetchLatestComments,
    prefetchSearchAnimeSchedule,
    prefetchSearchAnimes,
    prefetchSearchCollections,
    prefetchSearchUserWatches,
    prefetchSession,
    prefetchUserHistory,
} from '@hikka/react/server';

import getCurrentSeason from '@/utils/get-current-season';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

const prefetchQueries = async () => {
    const clientConfig = await getHikkaClientConfig();
    const queryClient = getQueryClient();
    const season = getCurrentSeason()!;
    const year = Number(new Date().getFullYear());

    const loggedUser = await prefetchSession({ clientConfig });

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
            }),
        );

        promises.push(
            prefetchUserHistory({
                username: loggedUser.username,
                clientConfig,
            }),
        );
    }

    promises.push(
        prefetchSearchAnimes({
            args: {
                season: [season!],
                score: [7, 10],
                years: [year, year],
            },
            clientConfig,
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
        }),
    );

    promises.push(
        prefetchSearchCollections({
            args: { sort: ['created:desc'] },
            clientConfig,
        }),
    );
    promises.push(prefetchLatestComments({ clientConfig }));

    await Promise.all(promises);
};

export default prefetchQueries;
