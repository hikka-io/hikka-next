import {
    AnimeAgeRatingEnum,
    AnimeMediaEnum,
    AnimeStatusEnum,
    CommonContentType,
    ContentStatusEnum,
    ContentTypeEnum,
    MangaMediaEnum,
    NovelMediaEnum,
    ReadContentType,
    ReadStatusEnum,
    SeasonEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { prefetchInfiniteQuery } from '@hikka/react/core';
import {
    searchUserReadsOptions,
    searchUserWatchesOptions,
} from '@hikka/react/options';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import Block from '@/components/ui/block';

import { ReadFilters } from '@/features/read';
import {
    Userlist,
    UserlistHeader,
    UserlistStatusCombobox,
    UserlistToolsCombobox,
    UserlistViewCombobox,
} from '@/features/users';
import { AnimeFilters } from '@/features/watch';

import { generateHeadMeta } from '@/utils/metadata';
import { userlistSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/u/$username/list/$content_type')({
    validateSearch: zodValidator(userlistSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ params, context: { queryClient, hikkaClient }, deps }) => {
        const { username, content_type } = params;
        const isAnime = content_type === ContentTypeEnum.ANIME;
        const defaultSort = isAnime ? 'watch_score' : 'read_score';
        const { status, sort: sortParam } = deps;

        if (!status || !sortParam) {
            throw redirect({
                to: '/u/$username/list/$content_type',
                params: { username, content_type },
                search: {
                    status: status || 'completed',
                    sort: sortParam || defaultSort,
                },
            });
        }

        const order = deps.order || 'desc';
        const sort = sortParam.length
            ? sortParam.map((item) => `${item}:${order}`)
            : undefined;

        if (isAnime) {
            const media_type = (deps.types ?? []) as AnimeMediaEnum[];
            const animeStatus = (deps.statuses ?? []) as AnimeStatusEnum[];
            const season = (deps.seasons ?? []) as SeasonEnum[];
            const rating = (deps.ratings ?? []) as AnimeAgeRatingEnum[];
            const years = (deps.years ?? []) as [number | null, number | null];
            const genres = deps.genres ?? [];
            const studios = deps.studios ?? [];

            await prefetchInfiniteQuery(
                queryClient,
                searchUserWatchesOptions(hikkaClient, {
                    username,
                    args: {
                        watch_status:
                            status !== 'all'
                                ? (status as WatchStatusEnum)
                                : undefined,
                        media_type,
                        status: animeStatus,
                        season,
                        rating,
                        years,
                        genres,
                        studios,
                        sort,
                    },
                }),
            );
        } else {
            const media_type = (deps.types ?? []) as (
                | NovelMediaEnum
                | MangaMediaEnum
            )[];
            const readContentStatus = (deps.statuses ??
                []) as ContentStatusEnum[];
            const years = (deps.years ?? []) as [number | null, number | null];
            const genres = deps.genres ?? [];
            const magazines = deps.magazines ?? [];

            await prefetchInfiniteQuery(
                queryClient,
                searchUserReadsOptions(hikkaClient, {
                    username,
                    contentType: content_type as ReadContentType,
                    args: {
                        read_status:
                            status !== 'all'
                                ? (status as ReadStatusEnum)
                                : undefined,
                        media_type,
                        status: readContentStatus,
                        years,
                        genres,
                        magazines,
                        sort,
                    },
                }),
            );
        }
    },
    head: ({ params }) =>
        generateHeadMeta({ title: `Список / ${params.username}` }),
    component: ListPage,
});

function ListPage() {
    const { content_type: rawContentType } = Route.useParams();
    const content_type = rawContentType as CommonContentType;
    const isAnime = content_type === ContentTypeEnum.ANIME;

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-12">
            <Block className="overflow-hidden">
                <UserlistHeader content_type={content_type} />
                <div className="flex items-center justify-between gap-2 overflow-hidden">
                    <UserlistStatusCombobox content_type={content_type} />
                    <div className="flex items-center gap-2">
                        <UserlistViewCombobox />
                        <UserlistToolsCombobox content_type={content_type} />
                    </div>
                </div>
                <Userlist content_type={content_type} />
            </Block>
            <div className="border-border bg-secondary/20 sticky top-20 hidden h-fit max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border backdrop-blur-xl lg:flex">
                {isAnime ? (
                    <AnimeFilters
                        sort_type="watch"
                        content_type={ContentTypeEnum.ANIME}
                    />
                ) : (
                    <ReadFilters
                        content_type={content_type as ReadContentType}
                        sort_type="read"
                    />
                )}
            </div>
        </div>
    );
}
