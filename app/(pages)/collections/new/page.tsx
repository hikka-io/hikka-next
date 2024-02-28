import React from 'react';

import CollectionGroups from '@/app/(pages)/collections/new/_components/collection-groups';
import SubHeader from '@/components/sub-header';
import CollectionProvider from '@/services/providers/collection-provider';

import CollectionSettings from './_components/collection-settings';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

const Component = ({ searchParams: { title } }: Props) => {
    return (
        <CollectionProvider>
            <div>
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                    <div className="flex flex-col gap-8">
                        <SubHeader
                            title={(title as string) || 'Нова колекція'}
                        />
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
