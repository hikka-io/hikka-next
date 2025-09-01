import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchSearchCollections } from '@hikka/react/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import PagePagination from '@/components/page-pagination';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import CollectionList from '@/features/collections/collection-list/collection-list';
import CollectionSort from '@/features/collections/collection-list/collection-sort';

import _generateMetadata from '@/utils/generate-metadata';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

export async function generateMetadata(): Promise<Metadata> {
    return _generateMetadata({
        title: {
            template: 'Колекції / %s / Hikka',
            default: 'Колекції',
        },
    });
}

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

const CollectionsPage: FC<Props> = async (props) => {
    const searchParams = await props.searchParams;
    const page = searchParams.page;
    const sort =
        (searchParams.sort as 'system_ranking' | 'created') || 'system_ranking';

    if (!searchParams.page) {
        permanentRedirect('/collections?page=1');
    }

    const queryClient = await getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const collections = await prefetchSearchCollections({
        args: { sort: [`${sort}:desc`] },
        paginationArgs: { page: Number(page) },
        clientConfig,
        queryClient,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Block>
                <div className="flex items-center justify-between gap-4">
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle variant="h2">Колекції</HeaderTitle>
                            {clientConfig.authToken && (
                                <Button
                                    asChild
                                    size="icon-sm"
                                    variant="outline"
                                >
                                    <Link href="/collections/new">
                                        <MaterialSymbolsAddRounded />
                                    </Link>
                                </Button>
                            )}
                        </HeaderContainer>
                    </Header>

                    <CollectionSort />
                </div>
                <CollectionList page={Number(page)} sort={sort} />
                {collections && (
                    <PagePagination
                        pagination={collections.pages[0].pagination}
                    />
                )}
            </Block>
        </HydrationBoundary>
    );
};

export default CollectionsPage;
