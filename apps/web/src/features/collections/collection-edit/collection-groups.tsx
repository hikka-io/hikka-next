import type { FC } from 'react';

import { useShallow } from 'zustand/shallow';

import CollectionEditGrid from './collection-grid';
import CollectionDndContext from './collection-grid/collection-dnd-context';
import { useCollectionContext } from './collection-provider';

const CollectionEditGroups: FC = () => {
    const groupIds = useCollectionContext(
        useShallow((state) => state.groups.map((group) => group.id)),
    );

    return (
        <CollectionDndContext>
            {groupIds.map((groupId) => (
                <CollectionEditGrid key={groupId} groupId={groupId} />
            ))}
        </CollectionDndContext>
    );
};

export default CollectionEditGroups;
