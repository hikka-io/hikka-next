import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { collectionsSearchSchema } from '@hikka/core';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import {
    CollectionFiltersButton,
    CollectionList,
    CollectionListFilters,
    CollectionTypeChips,
    CollectionViewToggle,
} from '@/features/collections';
import { collectionListOptions } from '@/features/collections/queries';
import { FiltersSidebarLayout } from '@/features/filters';
import { generateHeadMeta } from '@/utils/metadata';
import { Link } from '@/utils/navigation';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/collections/')({
    validateSearch: zodValidator(collectionsSearchSchema),
    beforeLoad: ({ search }) => {
        if (!search.page) {
            throw redirect({
                to: '/collections',
                search: { ...search, page: 1 },
            });
        }
    },
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, apiClient }, deps, preload }) => {
        if (preload) return;

        await queryClient.prefetchInfiniteQuery(
            collectionListOptions(deps, apiClient),
        );
    },
    head: () =>
        generateHeadMeta({
            title: 'Колекції',
            description: 'Колекції аніме, манґи та ранобе від спільноти Hikka',
            url: `${SITE_ORIGIN}/collections`,
        }),
    component: CollectionsPage,
});

function CollectionsPage() {
    const search = Route.useSearch();

    const titleAnchor = usePageTitleAnchor();

    usePageHeader({
        title: 'Колекції',
        parent: '/',
        anchored: true,
        actionsAnchored: true,
        actionsComponent: () => <CollectionFiltersButton inHeader />,
    });

    return (
        <FiltersSidebarLayout
            collapsible={false}
            className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[1fr_20rem] lg:items-start"
            contentClassName="flex min-w-0 flex-col"
            sidebar={<CollectionListFilters />}
        >
            <Block>
                <Header>
                    <HeaderTitle ref={titleAnchor} as="h1" size="page">
                        Колекції
                    </HeaderTitle>
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <Button
                                    size="icon-sm"
                                    variant="outline"
                                    aria-label="Нова колекція"
                                    render={<Link to="/collections/new" />}
                                />
                            }
                        >
                            <MaterialSymbolsAddRounded />
                        </TooltipTrigger>
                        <TooltipContent>Нова колекція</TooltipContent>
                    </Tooltip>
                    <HeaderActions>
                        <CollectionViewToggle />
                        <CollectionFiltersButton className="lg:hidden" />
                    </HeaderActions>
                </Header>
                <CollectionTypeChips />
                <CollectionList search={search} />
            </Block>
        </FiltersSidebarLayout>
    );
}
