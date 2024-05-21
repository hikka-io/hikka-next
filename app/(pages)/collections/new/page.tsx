import { Metadata } from 'next';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import CollectionGroups from '@/features/collections/collection-edit/collection-groups';
import CollectionSettings from '@/features/collections/collection-edit/collection-settings/collection-settings';
import CollectionTitle from '@/features/collections/collection-edit/collection-title';

import CollectionProvider from '@/services/providers/collection-provider';
import _generateMetadata from '@/utils/generateMetadata';

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
                    <Card className="sticky top-20 order-1 hidden w-full p-0 lg:order-2 lg:block">
                        <CollectionSettings />
                    </Card>
                </div>
            </>
        </CollectionProvider>
    );
};

export default CollectionNewPage;
