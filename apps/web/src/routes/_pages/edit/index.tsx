import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    type EditContentTypeEnum,
    type EditStatusEnum,
    editsTopInfiniteOptions,
    getEditsInfiniteOptions,
    paginatedInfiniteOptions,
    paginationPageParam,
} from '@hikka/api';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import {
    EditFilters,
    EditFiltersBody,
    EditList,
    EditTopStats,
} from '@/features/edit';
import { FiltersModal, FiltersSidebarLayout } from '@/features/filters';
import { generateHeadMeta } from '@/utils/metadata';
import { editSearchSchema } from '@/utils/search-schemas';
import { expandSort } from '@/utils/sort';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/edit/')({
    validateSearch: zodValidator(editSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, apiClient }, deps }) => {
        const { page, content_type, edit_status } = deps;

        if (!page) {
            throw redirect({
                to: '/edit',
                search: { ...deps, page: 1 },
            });
        }

        await Promise.allSettled([
            queryClient.ensureInfiniteQueryData(
                paginatedInfiniteOptions(
                    getEditsInfiniteOptions({
                        body: {
                            content_type:
                                (content_type as EditContentTypeEnum) ||
                                undefined,
                            sort: expandSort('edit', deps.sort, deps.order),
                            status: edit_status
                                ? (edit_status as EditStatusEnum)
                                : undefined,
                        },
                        client: apiClient,
                    }),
                    Number(page),
                ),
            ),
            queryClient.ensureInfiniteQueryData({
                ...editsTopInfiniteOptions({ client: apiClient }),
                ...paginationPageParam(),
            }),
        ]);
    },
    head: () =>
        generateHeadMeta({
            title: 'Правки',
            description: 'Система правок спільноти Hikka',
            url: `${SITE_ORIGIN}/edit`,
        }),
    component: EditListPage,
});

function EditListPage() {
    const titleAnchor = usePageTitleAnchor();

    usePageHeader({ title: 'Правки', parent: '/', anchored: true });

    return (
        <div className="flex flex-col gap-12 lg:gap-12">
            <EditTopStats />
            <FiltersSidebarLayout
                collapsible={false}
                className="grid grid-cols-1 justify-center gap-x-10 gap-y-8 lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between"
                contentClassName="flex min-w-0 flex-col gap-12"
                sidebar={<EditFilters />}
            >
                <Block>
                    <div className="flex items-center justify-between">
                        <Header>
                            <HeaderContainer>
                                <HeaderTitle ref={titleAnchor} variant="h2">
                                    Правки
                                </HeaderTitle>
                            </HeaderContainer>
                        </Header>
                        <FiltersModal
                            body={
                                <EditFiltersBody className="-m-4 flex-1 overflow-y-auto p-4" />
                            }
                        >
                            <Button
                                size="md"
                                variant="outline"
                                className="flex lg:hidden"
                            >
                                <AntDesignFilterFilled /> Фільтри
                            </Button>
                        </FiltersModal>
                    </div>
                    <EditList />
                </Block>
            </FiltersSidebarLayout>
        </div>
    );
}
