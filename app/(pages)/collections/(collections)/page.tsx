import { Metadata } from 'next';
import * as React from 'react';

import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import CollectionSort from '@/app/(pages)/collections/(collections)/_components/collection-sort';
import { getCookie } from '@/app/actions';
import PagePagination from '@/components/page-pagination';
import SubHeader from '@/components/sub-header';
import getCollections from '@/services/api/collections/getCollections';
import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';

import CollectionList from './_components/collection-list';


export async function generateMetadata(): Promise<Metadata> {
    return _generateMetadata({
        title: {
            template: 'Колекції / %s / Hikka',
            default: 'Колекції',
        },
    });
}

const Component = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    const page = searchParams.page;
    const sort = searchParams.sort as 'system_ranking' | 'created' || 'system_ranking';

    if (!searchParams.page) {
        redirect('/collections?page=1');
    }

    const queryClient = getQueryClient();
    const auth = await getCookie('auth');

    const collections = await queryClient.fetchQuery({
        queryKey: ['collections', { page: Number(page), auth, sort }],
        queryFn: () =>
            getCollections({
                page: Number(page),
                auth,
                sort: sort,
            }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between gap-4">
                    <SubHeader title="Колекції" />
                    <CollectionSort />
                </div>
                <CollectionList page={Number(page)} sort={sort} />
                {collections && (
                    <PagePagination pagination={collections.pagination} />
                )}
            </div>
        </HydrationBoundary>
    );
};

export default Component;
