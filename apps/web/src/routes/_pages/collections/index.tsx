import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import { CollectionList, CollectionSort } from '@/features/collections';
import {
    collectionListOptions,
    DEFAULT_COLLECTION_SORT,
} from '@/features/collections/queries';
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
            <CollectionList page={Number(page)} sort={sort} />
        </Block>
    );
}
