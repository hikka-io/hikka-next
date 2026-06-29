import { type FC, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getCollectionOptions } from '@hikka/api';

import { useCollectionContext } from '@/services/providers/collection-provider';
import { useParams } from '@/utils/navigation';

import CollectionEditGrid from './collection-grid';
import CollectionDndContext from './collection-grid/collection-dnd-context';

type Props = {
    mode?: 'create' | 'edit';
};

const CollectionGroups: FC<Props> = ({ mode = 'create' }) => {
    const params = useParams();

    const groups = useCollectionContext((state) => state.groups);
    const setApiData = useCollectionContext((state) => state.setApiData);

    const { data } = useQuery({
        ...getCollectionOptions({
            path: { reference: String(params.reference) },
        }),
        enabled: mode === 'edit',
    });

    useEffect(() => {
        if (data) {
            setApiData(data as Parameters<typeof setApiData>[0]);
        }
    }, [data]);

    if (mode === 'edit' && !data) {
        return null;
    }

    return (
        <CollectionDndContext>
            {groups.map((group) => (
                <CollectionEditGrid key={group.id} group={group} />
            ))}
        </CollectionDndContext>
    );
};

export default CollectionGroups;
