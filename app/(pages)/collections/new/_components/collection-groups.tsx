'use client';

import React, { useEffect } from 'react';

import { useParams } from 'next/navigation';

import useCollection from '@/services/hooks/collections/useCollection';
import { useCollectionContext } from '@/services/providers/collection-provider';

import CollectionGrid from './collection-grid';

interface Props {
    mode?: 'create' | 'edit';
}

const Component = ({ mode = 'create' }: Props) => {
    const params = useParams();
    const {
        groups,
        rawToState,
        setState: setCollectionState,
    } = useCollectionContext();

    const { data } = useCollection({
        reference: String(params.reference),
        enabled: mode === 'edit',
    });

    useEffect(() => {
        if (data) {
            setCollectionState!(rawToState!(data));
        }
    }, [data]);

    if (mode === 'edit' && !data) {
        return null;
    }

    return groups.map((group) => (
        <CollectionGrid key={group.id} group={group} />
    ));
};

export default Component;
