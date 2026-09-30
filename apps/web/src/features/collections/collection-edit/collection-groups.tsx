import type { FC } from 'react';

import CollectionEditGrid from './collection-grid';
import CollectionDndContext from './collection-grid/collection-dnd-context';
import { useCollectionContext } from './collection-provider';

const CollectionEditGroups: FC = () => {
    const groups = useCollectionContext((state) => state.groups);

    return (
        <CollectionDndContext>
            {groups.map((group) => (
                <CollectionEditGrid key={group.id} group={group} />
            ))}
        </CollectionDndContext>
    );
};

export default CollectionEditGroups;
