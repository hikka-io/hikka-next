import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchCollectionByReference } from '@hikka/react/server';
import { permanentRedirect } from 'next/navigation';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import CollectionGroups from '@/features/collections/collection-edit/collection-groups.component';
import CollectionSettings from '@/features/collections/collection-edit/collection-settings/collection-settings.component';
import CollectionTitle from '@/features/collections/collection-edit/collection-title.component';

import CollectionProvider from '@/services/providers/collection-provider';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

const CollectionUpdatePage = async (props: {
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
                <div>
                    <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                        <Block>
                            <CollectionTitle />
                            <div className="border-border bg-secondary/20 block rounded-md border lg:hidden">
                                <CollectionSettings mode="edit" />
                            </div>
                            <CollectionGroups mode="edit" />
                        </Block>
                        <Card className="sticky top-20 order-1 hidden w-full p-0 lg:order-2 lg:block">
                            <CollectionSettings mode="edit" />
                        </Card>
                    </div>
                </div>
            </CollectionProvider>
        </HydrationBoundary>
    );
};

export default CollectionUpdatePage;
