import { createFileRoute } from '@tanstack/react-router';

import type { CollectionContent, CollectionResponse } from '@hikka/client';
import { useCollectionByReference } from '@hikka/react';
import { queryKeys } from '@hikka/react/core';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    CollectionEditGroups as CollectionGroups,
    CollectionEditSettings as CollectionSettings,
    CollectionEditTitle as CollectionTitle,
} from '@/features/collections';
import CollectionProvider from '@/services/providers/collection-provider';
import { requireOwner } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/collections/$reference/update')({
    beforeLoad: async ({ params, context: { queryClient } }) => {
        const collection = queryClient.getQueryData<
            CollectionResponse<CollectionContent>
        >(queryKeys.collections.byReference(params.reference));

        requireOwner(
            queryClient,
            collection?.author?.username ?? '',
            `/collections/${params.reference}`,
        );
    },
    head: () =>
        generateHeadMeta({
            title: 'Редагувати колекцію',
            robots: { index: false },
        }),
    component: CollectionUpdatePage,
});

function CollectionUpdatePage() {
    const { reference } = Route.useParams();
    const { data: collection } = useCollectionByReference({ reference });

    if (!collection) return null;

    return (
        <CollectionProvider initialState={collection}>
            <div>
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-12">
                    <Block>
                        <CollectionTitle />
                        <div className="block rounded-md border border-border bg-secondary/20 backdrop-blur lg:hidden">
                            <CollectionSettings mode="edit" />
                        </div>
                        <CollectionGroups mode="edit" />
                    </Block>
                    <Card className="sticky top-20 order-1 hidden w-full bg-secondary/20 p-0 backdrop-blur lg:order-2 lg:block">
                        <CollectionSettings mode="edit" />
                    </Card>
                </div>
            </div>
        </CollectionProvider>
    );
}
