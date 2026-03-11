import {
    ContentStatusEnum,
    UserResponse,
    WatchStatusEnum,
} from '@hikka/client';
import { useSession } from '@hikka/react';
import { queryKeys } from '@hikka/react/core';
import {
    searchAnimeScheduleOptions,
    searchUserWatchesOptions,
} from '@hikka/react/options';
import { createFileRoute } from '@tanstack/react-router';

import CoverImage from '@/components/cover-image';

import { FeedLayout, FeedList } from '@/features/feed';

import { generateHeadMeta } from '@/utils/metadata';
import { getCurrentSeason } from '@/utils/season';

export const Route = createFileRoute('/_pages/')({
    head: () =>
        generateHeadMeta({
            title: 'Hikka - енциклопедія аніме, манґи та ранобе українською',
            url: 'https://hikka.io',
        }),
    loader: async ({ context: { queryClient, hikkaClient } }) => {
        const season = getCurrentSeason()!;
        const year = Number(new Date().getFullYear());

        const loggedUser: UserResponse | undefined = queryClient.getQueryData(
            queryKeys.user.me(),
        );

        const promises: Promise<unknown>[] = [];

        if (loggedUser) {
            promises.push(
                queryClient.ensureInfiniteQueryData(
                    searchUserWatchesOptions(hikkaClient, {
                        username: loggedUser.username,
                        args: {
                            watch_status: WatchStatusEnum.WATCHING,
                            sort: ['watch_updated:desc'],
                        },
                    }),
                ),
            );
        }

        promises.push(
            queryClient.ensureInfiniteQueryData(
                searchAnimeScheduleOptions(hikkaClient, {
                    args: {
                        airing_season: [season, year],
                        status: [
                            ContentStatusEnum.ONGOING,
                            ContentStatusEnum.ANNOUNCED,
                        ],
                    },
                }),
            ),
        );

        await Promise.allSettled(promises);
    },
    component: HomePage,
});

function HomePage() {
    const { user: loggedUser } = useSession();

    return (
        <>
            <CoverImage cover={loggedUser?.cover} />
            <FeedLayout>
                <FeedList />
            </FeedLayout>
        </>
    );
}
