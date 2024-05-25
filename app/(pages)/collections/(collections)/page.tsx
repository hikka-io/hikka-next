import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';

import PagePagination from '@/components/page-pagination';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';

import CollectionList from '@/features/collections/collection-list/collection-list.component';
import CollectionSort from '@/features/collections/collection-list/collection-sort';

import getCollections from '@/services/api/collections/getCollections';
import { getCookie } from '@/utils/cookies';
import _generateMetadata from '@/utils/generate-metadata';
import getQueryClient from '@/utils/get-query-client';

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

const CollectionsPage: FC<Props> = async ({ searchParams }) => {
    const page = searchParams.page;
    const sort =
        (searchParams.sort as 'system_ranking' | 'created') || 'system_ranking';

    if (!searchParams.page) {
        redirect('/collections?page=1');
    }

    const queryClient = await getQueryClient();
    const auth = await getCookie('auth');

    const collections = await queryClient.fetchQuery({
        queryKey: ['collections', { page: Number(page), sort }],
        queryFn: ({ meta }) =>
            getCollections({
                page: Number(page),
                params: {
                    sort: sort,
                },
            }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Block>
                <div className="flex items-center justify-between gap-4">
                    <Header title="Колекції">
                        {auth && (
                            <Button asChild size="icon-sm" variant="outline">
                                <Link href="/collections/new">
                                    <MaterialSymbolsAddRounded />
                                </Link>
                            </Button>
                        )}
                    </Header>
                    <CollectionSort />
                </div>
                <CollectionList page={Number(page)} sort={sort} />
                {collections && (
                    <PagePagination pagination={collections.pagination} />
                )}
            </Block>
        </HydrationBoundary>
    );
};

export default CollectionsPage;
