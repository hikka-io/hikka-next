import { Metadata } from 'next';
import React from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import CollectionGroups from '@/app/(pages)/collections/[reference]/components/collection-groups';
import CollectionInfo from '@/app/(pages)/collections/[reference]/components/collection-info/collection-info';
import CollectionTitle from '@/app/(pages)/collections/[reference]/components/collection-title';
import Comments from '@/components/comments/comments';
import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';
import getCollection from '@/services/api/collections/getCollection';
import CollectionProvider from '@/services/providers/collection-provider';
import _generateMetadata from '@/utils/generateMetadata';
import getQueryClient from '@/utils/getQueryClient';

export async function generateMetadata({
    params: { reference },
}: {
    params: Record<string, any>;
}): Promise<Metadata> {
    try {
        const collection = await getCollection({
            params: {
                reference,
            },
        });

        return _generateMetadata({
            title: `Колекції / ${collection.title}`,
        });
    } catch (e) {
        return _generateMetadata({
            title: `Колекції`,
        });
    }
}

const CollectionPage = async ({
    params: { reference },
}: {
    params: Record<string, any>;
}) => {
    const queryClient = await getQueryClient();

    let collection;

    try {
        collection = await queryClient.fetchQuery({
            queryKey: ['collection', reference],
            queryFn: ({ meta }) =>
                getCollection({
                    params: {
                        reference,
                    },
                    auth: meta?.auth,
                }),
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
                            <Block>
                                <CollectionTitle />
                                <div className="block lg:hidden">
                                    <CollectionInfo />
                                </div>
                                <CollectionGroups />
                            </Block>
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

export default CollectionPage;
