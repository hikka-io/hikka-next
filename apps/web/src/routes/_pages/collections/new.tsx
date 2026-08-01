import { createFileRoute } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';
import {
    CollectionEditGroups as CollectionGroups,
    CollectionEditSettings as CollectionSettings,
    CollectionEditTitle as CollectionTitle,
} from '@/features/collections';
import CollectionProvider from '@/services/providers/collection-provider';
import { requireAuth } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/collections/new')({
    beforeLoad: async ({ context: { queryClient } }) => {
        requireAuth(queryClient);
    },
    head: () =>
        generateHeadMeta({
            title: 'Нова колекція / Колекції',
            robots: { index: false },
        }),
    component: CollectionNewPage,
});

function CollectionNewPage() {
    usePageHeader({
        title: 'Нова колекція',
        parent: '/collections',
    });

    return (
        <CollectionProvider>
            <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-x-10">
                <Block>
                    <CollectionTitle />
                    <Card className="-mx-4 block w-auto rounded-none border-x-0 p-0 lg:hidden">
                        <CollectionSettings />
                    </Card>
                    <CollectionGroups />
                </Block>
                <Card className="sticky top-20 order-1 hidden w-full p-0 lg:order-2 lg:block">
                    <CollectionSettings />
                </Card>
            </div>
        </CollectionProvider>
    );
}
