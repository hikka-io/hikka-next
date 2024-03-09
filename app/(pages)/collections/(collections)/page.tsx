import * as React from 'react';

import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import { getCookie } from '@/app/actions';
import PagePagination from '@/components/page-pagination';
import getCollections from '@/services/api/collections/getCollections';
import getQueryClient from '@/utils/getQueryClient';

import CollectionList from './_components/collection-list';


const Component = async ({
    searchParams: { page },
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    if (!page) {
        redirect('/collections?page=1');
    }

    const queryClient = getQueryClient();
    const secret = await getCookie('secret');

    await queryClient.prefetchQuery({
        queryKey: ['collections', { page: Number(page), secret }],
        queryFn: () => getCollections({ page: Number(page), secret }),
    });

    const collections: API.WithPagination<API.Collection> | undefined =
        queryClient.getQueryData([
            'collections',
            {
                page: Number(page),
                secret,
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
