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
import Link from '@/components/ui/link';
import { CollectionList, CollectionSort } from '@/features/collections';
import { generateHeadMeta } from '@/utils/metadata';
import { collectionsSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/collections/')({
    validateSearch: zodValidator(collectionsSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, apiClient }, deps }) => {
        const { page, sort = 'system_ranking' } = deps;

        if (!page) {
            throw redirect({
                to: '/collections',
                search: { ...deps, page: 1 },
            });
        }

        const collections = await queryClient.ensureInfiniteQueryData(
            paginatedInfiniteOptions(
                getCollectionsInfiniteOptions({
                    body: { sort: [`${sort}:desc`] },
                    client: apiClient,
                }),
                Number(page),
            ),
        );

        return { collections, page: Number(page), sort };
    },
    head: () =>
        generateHeadMeta({
            title: 'Колекції',
            description: 'Колекції аніме, манґи та ранобе від спільноти Hikka',
            url: 'https://hikka.io/collections',
        }),
    component: CollectionsPage,
});

function CollectionsPage() {
    const { collections, page, sort } = Route.useLoaderData();

    return (
        <Block>
            <div className="flex items-center justify-between gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h2">Колекції</HeaderTitle>
                        <Button asChild size="icon-sm" variant="outline">
                            <Link to="/collections/new">
                                <MaterialSymbolsAddRounded />
                            </Link>
                        </Button>
                    </HeaderContainer>
                </Header>
                <CollectionSort />
            </div>
            <CollectionList page={page} sort={sort} />
            {collections && (
                <PagePagination pagination={collections.pages[0].pagination} />
            )}
        </Block>
    );
}
