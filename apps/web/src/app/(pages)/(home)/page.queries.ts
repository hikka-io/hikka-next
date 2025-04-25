import { ContentStatusEnum, WatchStatusEnum } from '@hikka/client';
import {
    getQueryClient,
    prefetchAnimeSchedule,
    prefetchAnimeSearch,
    prefetchCollectionsList,
    prefetchLatestComments,
    prefetchSession,
    prefetchUserHistory,
    prefetchWatchList,
} from '@hikka/react';

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
            prefetchWatchList({
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
        prefetchAnimeSearch({
            args: {
                season: [season!],
                score: [7, 10],
                years: [year, year],
            },
            clientConfig,
        }),
    );

    promises.push(
        prefetchAnimeSchedule({
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
        prefetchCollectionsList({
            args: { sort: ['created:desc'] },
            clientConfig,
        }),
    );
    promises.push(prefetchLatestComments({ clientConfig }));

    await Promise.all(promises);
};

export default prefetchQueries;
