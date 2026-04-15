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
import { Header, HeaderDescription, HeaderTitle } from '@/components/ui/header';
import type { StackSize } from '@/components/ui/stack';

import { useCatalogView } from '@/features/filters/hooks/use-catalog-view';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import { expandSort } from '@/features/filters/sort';
import { ReadFilters } from '@/features/read';
import { Userlist, UserlistNavbar } from '@/features/users';
import { AnimeFilters } from '@/features/watch';

import { cn } from '@/utils/cn';
import { generateHeadMeta } from '@/utils/metadata';
import { userlistSearchSchema } from '@/utils/search-schemas';

const TITLES: Record<string, string> = {
    [ContentTypeEnum.ANIME]: 'аніме',
    [ContentTypeEnum.MANGA]: 'манґи',
    [ContentTypeEnum.NOVEL]: 'ранобе',
};

const DESCRIPTIONS: Record<string, string> = {
    [ContentTypeEnum.ANIME]: 'Персональний список перегляду',
    [ContentTypeEnum.MANGA]: 'Персональний список читання',
    [ContentTypeEnum.NOVEL]: 'Персональний список читання',
};

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

        const sort = expandSort(
            isAnime ? 'watch' : 'read',
            sortParam,
            deps.order,
        );

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
    const { visible: sidebarVisible } = useFiltersSidebar(
        'userlist_filters_sidebar',
    );
    const { view } = useCatalogView('userlist');

    const extendedSize: StackSize = sidebarVisible ? 5 : 7;

    return (
        <Block>
            <Header className="flex-col items-start gap-1">
                <HeaderTitle variant="h2">
                    Список {TITLES[content_type]}
                </HeaderTitle>
                <HeaderDescription>
                    {DESCRIPTIONS[content_type]}
                </HeaderDescription>
            </Header>

            <div
                className={cn(
                    'grid grid-cols-1 lg:items-start lg:gap-8',
                    sidebarVisible &&
                        'lg:grid-cols-[1fr_30%] xl:grid-cols-[1fr_25%]',
                )}
            >
                <div className="flex flex-col gap-4">
                    <UserlistNavbar content_type={content_type} />
                    <Userlist
                        content_type={content_type}
                        extendedSize={
                            view === 'grid' ? extendedSize : undefined
                        }
                    />
                </div>

                {sidebarVisible && (
                    <div className="border-border bg-secondary/20 sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border backdrop-blur-xl lg:order-2 lg:flex">
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
                )}
            </div>
        </Block>
    );
}
