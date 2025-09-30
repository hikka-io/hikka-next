import {
    CollectionContent,
    CollectionResponse,
    ContentTypeEnum,
} from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getHikkaClient,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchCollectionByReference } from '@hikka/react/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';

import {
    CollectionViewAuthor as CollectionAuthor,
    CollectionViewGroups as CollectionGroups,
    CollectionViewNavbar as CollectionNavbar,
    CollectionViewTitle as CollectionTitle,
    TableOfContents,
} from '@/features/collections';
import { CommentList as Comments } from '@/features/comments';

import CollectionProvider from '@/services/providers/collection-provider';
import _generateMetadata from '@/utils/generate-metadata';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

export async function generateMetadata(props: {
    params: Promise<Record<string, any>>;
}): Promise<Metadata> {
    const params = await props.params;

    const { reference } = params;

    try {
        const client = getHikkaClient();
        const collection: CollectionResponse<CollectionContent> =
            await client.collections.getCollectionByReference(reference);

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

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const collection = await prefetchCollectionByReference({
        reference,
        clientConfig,
        queryClient,
    });

    if (!collection) {
        return permanentRedirect('/collections');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <CollectionProvider initialState={collection}>
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
                <div className="flex flex-col gap-12">
                    <div className="container max-w-3xl p-0">
                        <CollectionAuthor />
                    </div>
                    <div className="grid grid-cols-1 justify-items-center gap-12 lg:grid-cols-[auto_1fr_auto] lg:gap-4">
                        <div className="hidden min-w-52 max-w-56 lg:block" />
                        <Block className="max-w-3xl">
                            <CollectionTitle />
                            <CollectionGroups />
                        </Block>
                        <div className="hidden min-w-52 max-w-56 lg:block">
                            <div className="sticky top-20 h-[calc(100vh-5rem)]">
                                <TableOfContents className="max-h-[70vh] bg-secondary/20 opacity-60 backdrop-blur-xl transition-opacity hover:opacity-100" />
                            </div>
                        </div>
                    </div>
                    <div className="container max-w-3xl p-0">
                        <Comments
                            preview
                            slug={reference}
                            content_type={ContentTypeEnum.COLLECTION}
                        />
                    </div>

                    <CollectionNavbar />
                </div>
            </CollectionProvider>
        </HydrationBoundary>
    );
};

export default CollectionPage;
//max-w-3xl
