import { Metadata } from 'next';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import {
    CollectionEditGroups as CollectionGroups,
    CollectionEditSettings as CollectionSettings,
    CollectionEditTitle as CollectionTitle,
} from '@/features/collections';

import CollectionProvider from '@/services/providers/collection-provider';
import _generateMetadata from '@/utils/generate-metadata';

export async function generateMetadata(): Promise<Metadata> {
    return _generateMetadata({
        title: {
            template: 'Колекції / %s / Hikka',
            default: 'Колекції',
        },
    });
}

const CollectionNewPage = () => {
    return (
        <CollectionProvider>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <Label>Нова колекція</Label>
                    </div>
                </Breadcrumbs>
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                    <Block>
                        <CollectionTitle />
                        <Card className="block p-0 lg:hidden">
                            <CollectionSettings />
                        </Card>
                        <CollectionGroups />
                    </Block>
                    <Card className=" bg-secondary/20 sticky top-20 order-1 hidden w-full p-0 backdrop-blur-xl lg:order-2 lg:block">
                        <CollectionSettings />
                    </Card>
                </div>
            </>
        </CollectionProvider>
    );
};

export default CollectionNewPage;
