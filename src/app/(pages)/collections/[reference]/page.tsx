import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';

import CollectionAuthor from '@/features/collections/collection-view/collection-author';
import CollectionGroups from '@/features/collections/collection-view/collection-groups/collection-groups.component';
import CollectionNavbar from '@/features/collections/collection-view/collection-navbar/collection-navbar.component';
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
                <div className="container flex max-w-3xl flex-col gap-12 p-0">
                    <CollectionAuthor />
                    <Block>
                        <CollectionTitle />
                        <CollectionGroups />
                    </Block>
                    <CollectionNavbar />
                </div>
            </CollectionProvider>
        </HydrationBoundary>
    );
};

export default CollectionPage;
