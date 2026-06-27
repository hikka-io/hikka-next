import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    type AnimeAgeRatingEnum,
    type AnimeMediaEnum,
    type AnimeStatusEnum,
    type ContentStatusEnum,
    ContentTypeEnum,
    type MangaMediaEnum,
    type NovelMediaEnum,
    paginationPageParam,
    type ReadContentTypeEnum,
    type ReadStatusEnum,
    type SeasonEnum,
    userReadListInfiniteOptions,
    userWatchListInfiniteOptions,
    type WatchStatusEnum,
} from '@hikka/api';

import Block from '@/components/ui/block';
import { Header, HeaderDescription, HeaderTitle } from '@/components/ui/header';
import type { StackSize } from '@/components/ui/stack';
import { AnimeFilters, ReadFilters } from '@/features/filters';
import { useCatalogView } from '@/features/filters/hooks/use-catalog-view';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';
import { expandSort } from '@/features/filters/sort';
import { Userlist, UserlistNavbar } from '@/features/users';
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
    loader: async ({ params, context: { queryClient, apiClient }, deps }) => {
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
            const score = deps.score?.length
                ? (deps.score as [number, number])
                : undefined;

            await queryClient.ensureInfiniteQueryData({
                ...userWatchListInfiniteOptions({
                    path: { username },
                    body: {
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
                        score,
                        sort,
                    },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            });
        } else {
            // Generated ReadSearchArgs.media_type is typed MangaMediaEnum[];
            // novel media values are valid at runtime.
            const media_type = (deps.types ?? []) as (
                | NovelMediaEnum
                | MangaMediaEnum
            )[] as MangaMediaEnum[];
            const readContentStatus = (deps.statuses ??
                []) as ContentStatusEnum[];
            const years = (deps.years ?? []) as [number | null, number | null];
            const genres = deps.genres ?? [];
            const magazines = deps.magazines ?? [];
            const score = deps.score?.length
                ? (deps.score as [number, number])
                : undefined;

            await queryClient.ensureInfiniteQueryData({
                ...userReadListInfiniteOptions({
                    path: {
                        username,
                        content_type: content_type as ReadContentTypeEnum,
                    },
                    body: {
                        read_status:
                            status !== 'all'
                                ? (status as ReadStatusEnum)
                                : undefined,
                        media_type,
                        status: readContentStatus,
                        years,
                        genres,
                        magazines,
                        score,
                        sort,
                    },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            });
        }
    },
    head: ({ params }) =>
        generateHeadMeta({ title: `Список / ${params.username}` }),
    component: ListPage,
});

function ListPage() {
    const { content_type: rawContentType } = Route.useParams();
    const content_type = rawContentType as 'anime' | 'manga' | 'novel';
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
                    <div className="sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border border-border bg-secondary/20 backdrop-blur-xl lg:order-2 lg:flex">
                        {isAnime ? (
                            <AnimeFilters
                                sort_type="watch"
                                content_type={ContentTypeEnum.ANIME}
                            />
                        ) : (
                            <ReadFilters
                                content_type={content_type}
                                sort_type="read"
                            />
                        )}
                    </div>
                )}
            </div>
        </Block>
    );
}
