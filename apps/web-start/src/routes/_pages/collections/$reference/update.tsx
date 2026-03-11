import { useCollectionByReference } from '@hikka/react';
import { createFileRoute } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import { generateHeadMeta } from '@/utils/metadata';
import Card from '@/components/ui/card';
import {
    CollectionEditGroups as CollectionGroups,
    CollectionEditSettings as CollectionSettings,
    CollectionEditTitle as CollectionTitle,
} from '@/features/collections';
import CollectionProvider from '@/services/providers/collection-provider';

export const Route = createFileRoute('/_pages/collections/$reference/update')({
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
                        <div className="border-border bg-secondary/20 block rounded-md border lg:hidden">
                            <CollectionSettings mode="edit" />
                        </div>
                        <CollectionGroups mode="edit" />
                    </Block>
                    <Card className="bg-secondary/20 sticky top-20 order-1 hidden w-full p-0 backdrop-blur-xl lg:order-2 lg:block">
                        <CollectionSettings mode="edit" />
                    </Card>
                </div>
            </div>
        </CollectionProvider>
    );
}
