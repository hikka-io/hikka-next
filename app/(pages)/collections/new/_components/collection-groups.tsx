'use client';

import React, { useEffect } from 'react';

import { useCollectionContext } from '@/services/providers/collection-provider';

import CollectionGrid from './collection-grid';
import { useParams } from 'next/navigation';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useCollection } from '@/app/(pages)/collections/page.hooks';

interface Props {
    mode?: 'create' | 'edit';
}

const Component = ({ mode = 'create' }: Props) => {
    const params = useParams();
    const { secret } = useAuthContext();
    const {
        groups,
        rawToState,
        setState: setCollectionState,
    } = useCollectionContext();

    const { data } = useCollection({
        reference: String(params.reference),
        secret,
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
