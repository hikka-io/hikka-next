'use client';

import React, { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { useCollection } from '@/app/(pages)/collections/page.hooks';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useCollectionContext } from '@/services/providers/collection-provider';

import CollectionGrid from './collection-grid';


const Component = () => {
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

export default Component;
