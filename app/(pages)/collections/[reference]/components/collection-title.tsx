'use client';

import React from 'react';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import SubHeader from '@/components/sub-header';
import TextExpand from '@/components/text-expand';
import { useCollectionContext } from '@/services/providers/collection-provider';

const CollectionTitle = () => {
    const { title, description } = useCollectionContext();

    return (
        <div className="flex flex-col gap-2">
            <SubHeader title={title || 'Нова колекція'} />
            {description && (
                <TextExpand>
                    <MDViewer>{description}</MDViewer>
                </TextExpand>
            )}
        </div>
    );
};

export default CollectionTitle;
