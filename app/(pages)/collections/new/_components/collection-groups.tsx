'use client';

import React from 'react';

import { useCollectionContext } from '@/services/providers/collection-provider';

import CollectionGrid from './collection-grid';


const Component = () => {
    const { groups } = useCollectionContext();

    return groups.map((group) => (
        <CollectionGrid key={group.id} group={group} />
    ));
};

export default Component;
