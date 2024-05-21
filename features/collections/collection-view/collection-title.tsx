'use client';

import React from 'react';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import TextExpand from '@/components/text-expand';
import Header from '@/components/ui/header';

import { useCollectionContext } from '@/services/providers/collection-provider';

const CollectionTitle = () => {
    const { title, description } = useCollectionContext();

    return (
        <div className="flex flex-col gap-2">
            <Header variant="h2" title={title || 'Нова колекція'} />
            {description && (
                <TextExpand>
                    <MDViewer className="text-sm text-muted-foreground">
                        {description}
                    </MDViewer>
                </TextExpand>
            )}
        </div>
    );
};

export default CollectionTitle;
