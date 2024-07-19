'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import useCollection from '@/services/hooks/collections/use-collection';
import { useCollectionContext } from '@/services/providers/collection-provider';

import CollectionGrid from './collection-grid';

const CollectionGroups = () => {
    const params = useParams();
    const {
        groups,
        rawToState,
        setState: setCollectionState,
    } = useCollectionContext();

    const { data } = useCollection({
        reference: String(params.reference),
    });

    useEffect(() => {
        if (data) {
            setCollectionState!(rawToState!(data));
        }
    }, [data]);

    if (!data) {
        return null;
    }

    return groups.map((group) => (
        <CollectionGrid key={group.id} group={group} />
    ));
};

export default CollectionGroups;
