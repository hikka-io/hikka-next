import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { editsTopInfiniteOptions, paginationPageParam } from '@hikka/api';
import { editSearchSchema } from '@hikka/core';

import Block from '@/components/ui/block';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import {
    EditFilters,
    EditFiltersBody,
    EditList,
    EditTopStats,
} from '@/features/edit';
import { editListOptions } from '@/features/edit/queries';
import {
    FiltersButton,
    FiltersModal,
    FiltersSidebarLayout,
    HeaderFiltersButton,
    type RenderFiltersModal,
} from '@/features/filters';
import { generateHeadMeta } from '@/utils/metadata';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/edit/')({
    validateSearch: zodValidator(editSearchSchema),
    beforeLoad: ({ search }) => {
        if (!search.page) {
            throw redirect({
                to: '/edit',
                search: { ...search, page: 1 },
            });
        }
    },
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, apiClient }, deps, preload }) => {
        if (preload) return;

        await Promise.all([
            queryClient.prefetchInfiniteQuery(editListOptions(deps, apiClient)),
            queryClient.prefetchInfiniteQuery({
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

const renderFiltersModal: RenderFiltersModal = ({ open, onOpenChange }) => (
    <FiltersModal
        open={open}
        onOpenChange={onOpenChange}
        body={<EditFiltersBody className="-m-4 flex-1 overflow-y-auto p-4" />}
    />
);

function EditListPage() {
    const titleAnchor = usePageTitleAnchor();

    usePageHeader({
        title: 'Правки',
        parent: '/',
        anchored: true,
        actionsAnchored: true,
        actionsComponent: () => (
            <HeaderFiltersButton renderModal={renderFiltersModal} />
        ),
    });

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
                    <Header>
                        <HeaderTitle ref={titleAnchor} as="h1" size="page">
                            Правки
                        </HeaderTitle>
                        <HeaderActions className="lg:hidden">
                            <FiltersButton renderModal={renderFiltersModal} />
                        </HeaderActions>
                    </Header>
                    <EditList />
                </Block>
            </FiltersSidebarLayout>
        </div>
    );
}
