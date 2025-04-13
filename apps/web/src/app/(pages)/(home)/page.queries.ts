import { prefetchAnimeCatalog } from '@/services/hooks/anime/use-anime-catalog';
import { key, prefetchSession } from '@/services/hooks/auth/use-session';
import { prefetchCollections } from '@/services/hooks/collections/use-collections';
import { prefetchLatestComments } from '@/services/hooks/comments/use-latest-comments';
import { prefetchFollowingHistory } from '@/services/hooks/history/use-following-history';
import { prefetchAnimeSchedule } from '@/services/hooks/stats/use-anime-schedule';
import { prefetchWatchList } from '@/services/hooks/watch/use-watch-list';
import getCurrentSeason from '@/utils/get-current-season';
import getQueryClient from '@/utils/get-query-client';

const prefetchQueries = async () => {
    const queryClient = getQueryClient();
    const season = getCurrentSeason()!;
    const year = String(new Date().getFullYear());

    await prefetchSession();

    const loggedUser: API.User | undefined = queryClient.getQueryData(key());

    const promises = [];

    if (loggedUser) {
        promises.push(
            prefetchWatchList({
                username: loggedUser.username,
                watch_status: 'watching',
                sort: ['watch_updated:desc'],
            }),
        );

        promises.push(
            prefetchAnimeCatalog({
                season: [season!],
                score: [7, 8, 9, 10],
                years: [year, year],
                page: 1,
                iPage: 1,
            }),
        );

        promises.push(prefetchFollowingHistory());
    }

    promises.push(
        prefetchAnimeSchedule({
            airing_season: [season, String(new Date().getFullYear())],
            status: ['ongoing', 'announced'],
        }),
    );

    promises.push(prefetchCollections({ sort: 'created' }));
    promises.push(prefetchLatestComments());

    await Promise.all(promises);
};

export default prefetchQueries;
