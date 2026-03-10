import { searchCollectionsOptions } from '@hikka/react/options';
import { createFileRoute, redirect } from '@tanstack/react-router';
import Link from '@/components/ui/link';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import PagePagination from '@/components/page-pagination';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { CollectionList, CollectionSort } from '@/features/collections';

export const Route = createFileRoute('/_pages/collections/')({
    validateSearch: (search: Record<string, unknown>) => search as Record<string, any>,
    loader: async ({
        context: { queryClient, hikkaClient },
        location,
    }) => {
        const { page, sort = 'system_ranking' } = location.search as {
            page?: number;
            sort?: 'system_ranking' | 'created';
        };

        if (!page) {
            throw redirect({
                to: '/collections',
                search: { page: 1 },
            });
        }

        const collections = (await queryClient.ensureInfiniteQueryData(searchCollectionsOptions(hikkaClient, {
                args: { sort: [`${sort}:desc`] },
                paginationArgs: { page: Number(page) },
            }) as any)) as any;

        return { collections, page: Number(page), sort };
    },
    head: () => ({
        meta: [{ title: 'Колекції / Hikka' }],
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
                <PagePagination
                    pagination={collections.pages[0].pagination}
                />
            )}
        </Block>
    );
}
