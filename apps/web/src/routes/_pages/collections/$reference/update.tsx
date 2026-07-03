import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import type { GetCollectionResponse } from '@hikka/api';
import { getCollectionOptions, getCollectionQueryKey } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    CollectionEditGroups as CollectionGroups,
    CollectionEditSettings as CollectionSettings,
    CollectionEditTitle as CollectionTitle,
} from '@/features/collections';
import CollectionProvider from '@/services/providers/collection-provider';
import type { CollectionState } from '@/services/stores/collection-store';
import { requireOwner } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/collections/$reference/update')({
    beforeLoad: async ({ params, context: { queryClient } }) => {
        const collection = queryClient.getQueryData<GetCollectionResponse>(
            getCollectionQueryKey({ path: { reference: params.reference } }),
        );

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
    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference } }),
    );

    if (!collection) return null;

    return (
        <CollectionProvider
            initialState={collection as Partial<CollectionState>}
        >
            <div>
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-12">
                    <Block>
                        <CollectionTitle />
                        <div className="block rounded-md border border-border bg-secondary/20 backdrop-blur lg:hidden">
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
    );
}
