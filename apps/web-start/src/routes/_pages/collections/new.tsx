import { createFileRoute } from '@tanstack/react-router';

import Breadcrumbs from '@/features/common/nav-breadcrumbs';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    CollectionEditGroups as CollectionGroups,
    CollectionEditSettings as CollectionSettings,
    CollectionEditTitle as CollectionTitle,
} from '@/features/collections';
import CollectionProvider from '@/services/providers/collection-provider';

export const Route = createFileRoute('/_pages/collections/new')({
    head: () => ({
        meta: [{ title: 'Нова колекція / Колекції / Hikka' }],
    }),
    component: CollectionNewPage,
});

function CollectionNewPage() {
    return (
        <CollectionProvider>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <Label>Нова колекція</Label>
                    </div>
                </Breadcrumbs>
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-12">
                    <Block>
                        <CollectionTitle />
                        <Card className="block p-0 lg:hidden">
                            <CollectionSettings />
                        </Card>
                        <CollectionGroups />
                    </Block>
                    <Card className="bg-secondary/20 sticky top-20 order-1 hidden w-full p-0 backdrop-blur-xl lg:order-2 lg:block">
                        <CollectionSettings />
                    </Card>
                </div>
            </>
        </CollectionProvider>
    );
}
