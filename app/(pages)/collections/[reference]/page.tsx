import { Metadata } from 'next';
import React from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import { getCookie } from '@/app/actions';
import Breadcrumbs from '@/components/breadcrumbs';
import Comments from '@/components/comments/comments';
import getCollection from '@/services/api/collections/getCollection';
import CollectionProvider from '@/services/providers/collection-provider';
import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';

import CollectionGroups from './_components/collection-groups';
import CollectionInfo from './_components/collection-info';
import CollectionTitle from './_components/collection-title';


export async function generateMetadata({
    params: { reference },
}: {
    params: Record<string, any>;
}): Promise<Metadata> {
    const secret = await getCookie('secret');

    try {
        const collection = await getCollection({ reference, secret });

        return _generateMetadata({
            title: `Колекції / ${collection.title}`,
        });
    } catch (e) {
        return _generateMetadata({
            title: `Колекції`,
        });
    }
}

const Component = async ({
    params: { reference },
}: {
    params: Record<string, any>;
}) => {
    const queryClient = getQueryClient();
    const secret = await getCookie('secret');

    let collection;

    try {
        collection = await queryClient.fetchQuery({
            queryKey: ['collection', reference, { secret }],
            queryFn: () => getCollection({ reference, secret }),
        });
    } catch (e) {
        return redirect('/collections');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <CollectionProvider>
                <>
                    <Breadcrumbs>
                        <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                            <Link
                                href={'/collections/' + reference}
                                className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                            >
                                {collection?.title}
                            </Link>
                        </div>
                    </Breadcrumbs>
                    <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col gap-8">
                                <CollectionTitle />
                                <div className="block lg:hidden">
                                    <CollectionInfo />
                                </div>
                                <CollectionGroups />
                            </div>
                            <Comments
                                slug={reference}
                                content_type="collection"
                            />
                        </div>
                        <div className="order-1 hidden w-full lg:order-2 lg:block">
                            <CollectionInfo />
                        </div>
                    </div>
                </>
            </CollectionProvider>
        </HydrationBoundary>
    );
};

export default Component;
