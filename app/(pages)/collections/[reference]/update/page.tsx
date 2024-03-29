import React from 'react';

import CollectionProvider from '@/services/providers/collection-provider';

import CollectionGroups from '@/app/(pages)/collections/new/components/collection-groups';
import CollectionSettings from '@/app/(pages)/collections/new/components/collection-settings';
import CollectionTitle from '@/app/(pages)/collections/new/components/collection-title';


const CollectionUpdatePage = () => {
    return (
        <CollectionProvider>
            <div>
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                    <div className="flex flex-col gap-8">
                        <CollectionTitle />
                        <div className="block rounded-md border border-secondary/60 bg-secondary/30 lg:hidden">
                            <CollectionSettings mode="edit"  />
                        </div>
                        <CollectionGroups mode="edit" />
                    </div>
                    <div
                        className="sticky top-20 order-1 hidden w-full rounded-md border border-secondary/60 bg-secondary/30 lg:order-2 lg:block">
                        <CollectionSettings mode="edit" />
                    </div>
                </div>
            </div>
        </CollectionProvider>
    );
};

export default CollectionUpdatePage;
