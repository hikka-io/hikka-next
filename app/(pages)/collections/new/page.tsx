import React from 'react';

import CollectionProvider from '@/services/providers/collection-provider';

import CollectionGroups from './_components/collection-groups';
import CollectionSettings from './_components/collection-settings';
import CollectionTitle from './_components/collection-title';


const Component = () => {
    return (
        <CollectionProvider>
            <div>
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                    <div className="flex flex-col gap-8">
                        <CollectionTitle />
                        <div className="block lg:hidden bg-secondary/30 border border-secondary/60 rounded-md">
                            <CollectionSettings />
                        </div>
                        <CollectionGroups />
                    </div>
                    <div className="order-1 hidden w-full lg:order-2 lg:block bg-secondary/30 border border-secondary/60 rounded-md sticky top-20">
                        <CollectionSettings />
                    </div>
                </div>
            </div>
        </CollectionProvider>
    );
};

export default Component;
