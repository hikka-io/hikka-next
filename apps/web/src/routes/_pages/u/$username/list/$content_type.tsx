import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    ContentTypeEnum,
    type MainContentTypeEnum,
    paginationPageParam,
    type ReadContentTypeEnum,
    userReadStatsOptions,
    userWatchStatsOptions,
} from '@hikka/api';

import ContentTypeTabs from '@/components/content-type-tabs';
import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import type { StackSize } from '@/components/ui/stack';
import { useCatalogView } from '@/features/catalog';
import {
    AnimeFilters,
    FiltersSidebarLayout,
    ReadFilters,
    useFiltersSidebar,
} from '@/features/filters';
import {
    USER_LIST_FILTERS_SIDEBAR_KEY,
    UserList,
    UserListNavbar,
} from '@/features/users';
import {
    userReadListOptions,
    userWatchListOptions,
} from '@/features/users/queries';
import { CONTENT_TYPES } from '@/utils/labels';
import { generateHeadMeta } from '@/utils/metadata';
import { userlistSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/u/$username/list/$content_type')({
    validateSearch: zodValidator(userlistSearchSchema),
    loaderDeps: ({ search }) => search,
    beforeLoad: ({ params, search }) => {
        const { username, content_type } = params;
        const { status, sort } = search;

        if (!status || !sort) {
            const defaultSort =
                content_type === ContentTypeEnum.ANIME
                    ? 'watch_score'
                    : 'read_score';

            throw redirect({
                to: '/u/$username/list/$content_type',
                params: { username, content_type },
                search: {
                    status: status || 'completed',
                    sort: sort || defaultSort,
                },
            });
        }
    },
    loader: async ({ params, context: { queryClient, apiClient }, deps }) => {
        const { username, content_type } = params;
        const prefetches = () =>
            content_type === ContentTypeEnum.ANIME
                ? [
                      queryClient.prefetchInfiniteQuery({
                          ...userWatchListOptions(username, deps, apiClient),
                          ...paginationPageParam(),
                      }),
                      queryClient.prefetchQuery(
                          userWatchStatsOptions({
                              path: { username },
                              client: apiClient,
                          }),
                      ),
                  ]
                : [
                      queryClient.prefetchInfiniteQuery({
                          ...userReadListOptions(
                              username,
                              content_type as ReadContentTypeEnum,
                              deps,
                              apiClient,
                          ),
                          ...paginationPageParam(),
                      }),
                      queryClient.prefetchQuery(
                          userReadStatsOptions({
                              path: {
                                  username,
                                  content_type:
                                      content_type as ReadContentTypeEnum,
                              },
                              client: apiClient,
                          }),
                      ),
                  ];

        if (typeof window !== 'undefined') {
            prefetches();
            return;
        }

        await Promise.allSettled(prefetches());
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
        USER_LIST_FILTERS_SIDEBAR_KEY,
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

            <FiltersSidebarLayout
                storageKey={USER_LIST_FILTERS_SIDEBAR_KEY}
                sidebar={
                    isAnime ? (
                        <AnimeFilters
                            sort_type="watch"
                            content_type={ContentTypeEnum.ANIME}
                        />
                    ) : (
                        <ReadFilters
                            content_type={content_type}
                            sort_type="read"
                        />
                    )
                }
            >
                <UserListNavbar content_type={content_type} />
                <UserList
                    content_type={content_type}
                    extendedSize={view === 'grid' ? extendedSize : undefined}
                />
            </FiltersSidebarLayout>
        </Block>
    );
}
