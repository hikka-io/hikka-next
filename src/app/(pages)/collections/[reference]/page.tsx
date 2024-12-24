import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';

import CollectionGroups from '@/features/collections/collection-view/collection-groups/collection-groups.component';
import CollectionInfo from '@/features/collections/collection-view/collection-info/collection-info.component';
import CollectionTitle from '@/features/collections/collection-view/collection-title.component';

import getCollection from '@/services/api/collections/getCollection';
import {
    key,
    prefetchCollection,
} from '@/services/hooks/collections/use-collection';
import CollectionProvider from '@/services/providers/collection-provider';
import _generateMetadata from '@/utils/generate-metadata';
import getQueryClient from '@/utils/get-query-client';

export async function generateMetadata(props: {
    params: Promise<Record<string, any>>;
}): Promise<Metadata> {
    const params = await props.params;

    const { reference } = params;

    try {
        const collection = await getCollection({
            params: {
                reference,
            },
        });

        return _generateMetadata({
            title: `${collection.title} / Колекції`,
        });
    } catch (e) {
        return _generateMetadata({
            title: `Колекції`,
        });
    }
}

const CollectionPage = async (props: {
    params: Promise<Record<string, any>>;
}) => {
    const params = await props.params;

    const { reference } = params;

    const queryClient = await getQueryClient();

    await prefetchCollection({ reference });

    const collection: API.Collection<API.MainContent> | undefined =
        queryClient.getQueryData(key({ reference }));

    if (!collection) {
        return permanentRedirect('/collections');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <CollectionProvider>
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
                    </div>
                    <div className="order-1 hidden w-full lg:order-2 lg:flex lg:h-full lg:flex-col">
                        <CollectionInfo />
                    </div>
                </div>
            </CollectionProvider>
        </HydrationBoundary>
    );
};

export default CollectionPage;
