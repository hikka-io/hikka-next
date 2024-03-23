import { Metadata } from 'next';
import * as React from 'react';

import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import { getCookie } from '@/app/actions';
import PagePagination from '@/components/page-pagination';
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
    searchParams: { page },
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    if (!page) {
        redirect('/collections?page=1');
    }

    const queryClient = getQueryClient();
    const auth = await getCookie('auth');

    await queryClient.prefetchQuery({
        queryKey: ['collections', { page: Number(page), auth }],
        queryFn: () => getCollections({ page: Number(page), auth }),
    });

    const collections: API.WithPagination<API.Collection> | undefined =
        queryClient.getQueryData([
            'collections',
            {
                page: Number(page),
                auth,
            },
        ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-8">
                <CollectionList collections={collections} />
                {collections && (
                    <PagePagination pagination={collections.pagination} />
                )}
            </div>
        </HydrationBoundary>
    );
};

export default Component;
