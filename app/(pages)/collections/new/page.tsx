import { Metadata } from 'next';
import React from 'react';

import Breadcrumbs from '@/components/breadcrumbs';
import { Label } from '@/components/ui/label';
import CollectionProvider from '@/services/providers/collection-provider';
import _generateMetadata from '@/utils/generateMetadata';

import CollectionGroups from '@/app/(pages)/collections/new/components/collection-groups';
import CollectionSettings from '@/app/(pages)/collections/new/components/collection-settings';
import CollectionTitle from '@/app/(pages)/collections/new/components/collection-title';


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
                    <div className="flex flex-col gap-8">
                        <CollectionTitle />
                        <div className="block rounded-md border border-secondary/60 bg-secondary/30 lg:hidden">
                            <CollectionSettings />
                        </div>
                        <CollectionGroups />
                    </div>
                    <div className="sticky top-20 order-1 hidden w-full rounded-md border border-secondary/60 bg-secondary/30 lg:order-2 lg:block">
                        <CollectionSettings />
                    </div>
                </div>
            </>
        </CollectionProvider>
    );
};

export default CollectionNewPage;
