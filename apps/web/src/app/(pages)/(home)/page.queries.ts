import { ContentStatusEnum, WatchStatusEnum } from '@hikka/client';
import { QueryClient } from '@hikka/react/core';
import {
    prefetchSearchAnimeSchedule,
    prefetchSearchUserWatches,
    prefetchSession,
} from '@hikka/react/server';

import { getHikkaClientConfig } from '@/utils/hikka-client';
import { getCurrentSeason } from '@/utils/season';

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
    }

    promises.push(
        prefetchSearchAnimeSchedule({
            args: {
                airing_season: [season, year],
                status: [
                    ContentStatusEnum.ONGOING,
                    ContentStatusEnum.ANNOUNCED,
                ],
            },
            clientConfig,
            queryClient,
        }),
    );

    await Promise.all(promises);
};

export default prefetchQueries;
