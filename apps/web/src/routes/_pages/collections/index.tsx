import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { collectionsSearchSchema, DEFAULT_COLLECTION_SORT } from '@hikka/core';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderTitle } from '@/components/ui/header';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import { CollectionList, CollectionSort } from '@/features/collections';
import { collectionListOptions } from '@/features/collections/queries';
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
    const { page, sort = DEFAULT_COLLECTION_SORT } = Route.useSearch();

    const titleAnchor = usePageTitleAnchor();

    usePageHeader({ title: 'Колекції', parent: '/', anchored: true });

    return (
        <Block>
            <div className="flex items-center justify-between gap-4">
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
                </Header>
                <CollectionSort />
            </div>
            <CollectionList page={Number(page)} sort={sort} />
        </Block>
    );
}
