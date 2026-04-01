'use client';

import { useCollectionByReference } from '@hikka/react';
import { FC, useEffect } from 'react';

import { useCollectionContext } from '@/services/providers/collection-provider';
import { useParams } from '@/utils/navigation';

import CollectionGrid from './collection-grid';
import CollectionDndContext from './collection-grid/collection-dnd-context';

interface Props {
    mode?: 'create' | 'edit';
}

const CollectionGroups: FC<Props> = ({ mode = 'create' }) => {
    const params = useParams();

    const groups = useCollectionContext((state) => state.groups);
    const setApiData = useCollectionContext((state) => state.setApiData);

    const { data } = useCollectionByReference({
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

    return (
        <CollectionDndContext>
            {groups.map((group) => (
                <CollectionGrid key={group.id} group={group} />
            ))}
        </CollectionDndContext>
    );
};

export default CollectionGroups;
