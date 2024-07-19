import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import CollectionGroups from '@/features/collections/collection-edit/collection-groups.component';
import CollectionSettings from '@/features/collections/collection-edit/collection-settings/collection-settings.component';
import CollectionTitle from '@/features/collections/collection-edit/collection-title.component';

import CollectionProvider from '@/services/providers/collection-provider';

const CollectionUpdatePage = () => {
    return (
        <CollectionProvider>
            <div>
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                    <Block>
                        <CollectionTitle />
                        <div className="block rounded-md border border-secondary/60 bg-secondary/30 lg:hidden">
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
};

export default CollectionUpdatePage;
