import type { FC } from 'react';

import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';

import Stack from '@/components/ui/stack';
import { cn } from '@/utils/cn';

import { useCollectionContext } from '../collection-provider';
import type { Item } from '../collection-store';
import AddTitleTile from './add-title-tile';
import { GROUP_DRAG_TYPE, groupSortableId, ITEM_DRAG_TYPE } from './card-moves';
import CollectionItemCard from './collection-item-card';
import EmptyGroup from './empty-group';
import GroupHeader from './group-header';

type Props = {
    groupId: string;
    index: number;
};

const NO_ITEMS: Item[] = [];

const CollectionGroup: FC<Props> = ({ groupId, index }) => {
    const items = useCollectionContext(
        (state) =>
            state.groups.find((group) => group.id === groupId)?.items ??
            NO_ITEMS,
    );
    const named = useCollectionContext(
        (state) =>
            state.groups.find((group) => group.id === groupId)?.title !== null,
    );

    const {
        ref: sortableRef,
        handleRef,
        isDragSource,
    } = useSortable({
        id: groupSortableId(groupId),
        index,
        type: GROUP_DRAG_TYPE,
        accept: GROUP_DRAG_TYPE,
        disabled: !named,
    });
    const { ref: dropRef, isDropTarget } = useDroppable({
        id: groupId,
        accept: ITEM_DRAG_TYPE,
        collisionPriority: CollisionPriority.Low,
    });

    return (
        <section
            ref={sortableRef}
            className={cn('flex flex-col gap-4', isDragSource && 'opacity-40')}
        >
            {named && <GroupHeader groupId={groupId} handleRef={handleRef} />}
            <div
                ref={dropRef}
                className={cn(
                    'rounded-lg outline-2 outline-transparent outline-offset-8 transition-[outline-color]',
                    isDropTarget && 'outline-primary-border',
                )}
            >
                {items.length > 0 ? (
                    <Stack size={5} extendedSize={5} extended>
                        {items.map((item, itemIndex) => (
                            <CollectionItemCard
                                key={item.id}
                                item={item}
                                index={itemIndex}
                                groupId={groupId}
                            />
                        ))}
                        <AddTitleTile groupId={groupId} />
                    </Stack>
                ) : (
                    <EmptyGroup groupId={groupId} />
                )}
            </div>
        </section>
    );
};

export default CollectionGroup;
