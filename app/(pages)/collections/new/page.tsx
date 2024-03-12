import { Metadata } from 'next';
import React from 'react';

import Breadcrumbs from '@/components/breadcrumbs';
import { Label } from '@/components/ui/label';
import CollectionProvider from '@/services/providers/collection-provider';
import _generateMetadata from '@/utils/generateMetadata';

import CollectionGroups from './_components/collection-groups';
import CollectionSettings from './_components/collection-settings';
import CollectionTitle from './_components/collection-title';

export async function generateMetadata(): Promise<Metadata> {
    return _generateMetadata({
        title: {
            template: 'Колекції / %s / Hikka',
            default: 'Колекції',
        },
    });
}

const Component = () => {
    return (
        <CollectionProvider>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <Label>Нова колекція</Label>
                    </div>
                </Breadcrumbs>
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
            </>
        </CollectionProvider>
    );
};

export default Component;
