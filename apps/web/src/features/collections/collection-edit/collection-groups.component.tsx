'use client';

import { useCollection } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC, useEffect } from 'react';

import { useCollectionContext } from '@/services/providers/collection-provider';

import CollectionGrid from './collection-grid/collection-grid.component';

interface Props {
    mode?: 'create' | 'edit';
}

const CollectionGroups: FC<Props> = ({ mode = 'create' }) => {
    const params = useParams();

    const groups = useCollectionContext((state) => state.groups);
    const setApiData = useCollectionContext((state) => state.setApiData);

    const { data } = useCollection({
        reference: String(params.reference),
        options: { enabled: mode === 'edit' },
    });

    useEffect(() => {
        if (data) {
            setApiData(data);
        }
    }, [data]);

    if (mode === 'edit' && !data) {
        return null;
    }

    return groups.map((group) => (
        <CollectionGrid key={group.id} group={group} />
    ));
};

export default CollectionGroups;
