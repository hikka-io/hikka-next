import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    getCollectionsInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import PagePagination from '@/components/page-pagination';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import { CollectionList, CollectionSort } from '@/features/collections';
import { retryOnCancel } from '@/utils/api/retry-on-cancel';
import { generateHeadMeta } from '@/utils/metadata';
import { Link } from '@/utils/navigation';
import { collectionsSearchSchema } from '@/utils/search-schemas';
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
    // A hover preload skips the list, so a click must rerun the loader and wait for it.
    preloadStaleTime: 0,
    loader: {
        staleReloadMode: 'blocking',
        handler: async ({
            context: { queryClient, apiClient },
            deps,
            preload,
        }) => {
            const { page, sort = 'system_ranking' } = deps;

            if (preload)
                return { page: Number(page), sort, pagination: undefined };

            const collections = await retryOnCancel(() =>
                queryClient.ensureInfiniteQueryData(
                    paginatedInfiniteOptions(
                        getCollectionsInfiniteOptions({
                            body: { sort: [`${sort}:desc`] },
                            client: apiClient,
                        }),
                        Number(page),
                    ),
                ),
            );

            return {
                page: Number(page),
                sort,
                pagination: collections.pages[0].pagination,
            };
        },
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
    const { page, sort, pagination } = Route.useLoaderData();

    const titleAnchor = usePageTitleAnchor();

    usePageHeader({ title: 'Колекції', parent: '/', anchored: true });

    return (
        <Block>
            <div className="flex items-center justify-between gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle ref={titleAnchor} variant="h2">
                            Колекції
                        </HeaderTitle>
                        <Button
                            size="icon-sm"
                            variant="outline"
                            render={<Link to="/collections/new" />}
                        >
                            <MaterialSymbolsAddRounded />
                        </Button>
                    </HeaderContainer>
                </Header>
                <CollectionSort />
            </div>
            <CollectionList page={page} sort={sort} />
            {pagination && <PagePagination pagination={pagination} />}
        </Block>
    );
}
