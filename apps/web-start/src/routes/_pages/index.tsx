import {
    ContentStatusEnum,
    ContentTypeEnum,
    FeedContentType,
    UserResponse,
    WatchStatusEnum,
} from '@hikka/client';
import { useSession } from '@hikka/react';
import { queryKeys } from '@hikka/react/core';
import {
    feedOptions,
    followingHistoryOptions,
    searchAnimeScheduleOptions,
    searchUserWatchesOptions,
} from '@hikka/react/options';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import CoverImage from '@/components/cover-image';

import { FeedLayout, FeedList } from '@/features/feed';

import { generateHeadMeta } from '@/utils/metadata';
import { feedSearchSchema } from '@/utils/search-schemas';
import { getCurrentSeason } from '@/utils/season';

const FEED_TYPE_TO_CONTENT_TYPE: Record<string, FeedContentType> = {
    comments: ContentTypeEnum.COMMENT,
    articles: ContentTypeEnum.ARTICLE,
    collections: ContentTypeEnum.COLLECTION,
};

export const Route = createFileRoute('/_pages/')({
    validateSearch: zodValidator(feedSearchSchema),
    loaderDeps: ({ search }) => ({ type: search.type }),
    head: () =>
        generateHeadMeta({
            title: 'Hikka - енциклопедія аніме, манґи та ранобе українською',
            url: 'https://hikka.io',
        }),
    loader: async ({ context: { queryClient, hikkaClient }, deps }) => {
        const { type } = deps;
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

        if (type === 'activity') {
            if (loggedUser) {
                promises.push(
                    queryClient.ensureInfiniteQueryData(
                        followingHistoryOptions(hikkaClient),
                    ),
                );
            }
        } else {
            const contentType = type
                ? FEED_TYPE_TO_CONTENT_TYPE[type]
                : undefined;

            promises.push(
                queryClient.ensureInfiniteQueryData(
                    feedOptions(hikkaClient, {
                        args: { content_type: contentType },
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
