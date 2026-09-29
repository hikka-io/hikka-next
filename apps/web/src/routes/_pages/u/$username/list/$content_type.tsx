import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    paginationPageParam,
    type ReadContentTypeEnum,
} from '@hikka/api';

import ContentTypeTabs from '@/components/content-type-tabs';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import type { StackSize } from '@/components/ui/stack';
import { useCatalogView } from '@/features/catalog';
import {
    AnimeFilters,
    ReadFilters,
    useFiltersSidebar,
} from '@/features/filters';
import { UserList, UserListNavbar } from '@/features/users';
import {
    userReadListOptions,
    userWatchListOptions,
} from '@/features/users/queries';
import { cn } from '@/utils/cn';
import { CONTENT_TYPES } from '@/utils/labels';
import { generateHeadMeta } from '@/utils/metadata';
import { userlistSearchSchema } from '@/utils/search-schemas';

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

        if (isAnime) {
            await queryClient.prefetchInfiniteQuery({
                ...userWatchListOptions(username, deps, apiClient),
                ...paginationPageParam(),
            });
        } else {
            await queryClient.prefetchInfiniteQuery({
                ...userReadListOptions(
                    username,
                    content_type as ReadContentTypeEnum,
                    deps,
                    apiClient,
                ),
                ...paginationPageParam(),
            });
        }
    },
    head: ({ params }) =>
        generateHeadMeta({ title: `Список / ${params.username}` }),
    component: ListPage,
});

function ListPage() {
    const { username, content_type: rawContentType } = Route.useParams();
    const content_type = rawContentType as MainContentTypeEnum;
    const isAnime = content_type === ContentTypeEnum.ANIME;
    const { visible: sidebarVisible } = useFiltersSidebar(
        'userlist_filters_sidebar',
    );
    const { view } = useCatalogView('userlist');

    const extendedSize: StackSize = sidebarVisible ? 5 : 7;

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle variant="h2">
                        Список {CONTENT_TYPES[content_type].genitive}
                    </HeaderTitle>
                </HeaderContainer>
            </Header>
            <ContentTypeTabs
                value={content_type}
                urlFor={(type) => `/u/${username}/list/${type}`}
            />

            <div
                className={cn(
                    'grid grid-cols-1 lg:items-start lg:gap-x-10',
                    sidebarVisible &&
                        'lg:grid-cols-[1fr_30%] xl:grid-cols-[1fr_25%]',
                )}
            >
                <div className="flex flex-col gap-4">
                    <UserListNavbar content_type={content_type} />
                    <UserList
                        content_type={content_type}
                        extendedSize={
                            view === 'grid' ? extendedSize : undefined
                        }
                    />
                </div>

                {sidebarVisible && (
                    <div className="sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border border-border surface lg:order-2 lg:flex">
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
