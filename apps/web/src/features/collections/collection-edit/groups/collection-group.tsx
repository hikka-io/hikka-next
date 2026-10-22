import type { FC } from 'react';

import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';

import Stack from '@/components/ui/stack';
import { cn } from '@/utils/cn';

import { useCollectionContext } from '../collection-provider';
import type { Item } from '../collection-store';
import AddTitleTile from './add-title-tile';
import CollectionItemCard from './collection-item-card';
import EmptyGroup from './empty-group';
import GroupHeader from './group-header';

type Props = {
    groupId: string;
};

const NO_ITEMS: Item[] = [];

const CollectionGroup: FC<Props> = ({ groupId }) => {
    const items = useCollectionContext(
        (state) =>
            state.groups.find((group) => group.id === groupId)?.items ??
            NO_ITEMS,
    );
    const named = useCollectionContext(
        (state) =>
            state.groups.find((group) => group.id === groupId)?.title !== null,
    );

    const { ref, isDropTarget } = useDroppable({
        id: groupId,
        collisionPriority: CollisionPriority.Low,
    });

    return (
        <section className="flex flex-col gap-4">
            {named && <GroupHeader groupId={groupId} />}
            <div
                ref={ref}
                className={cn(
                    'rounded-lg outline-2 outline-transparent outline-offset-8 transition-[outline-color]',
                    isDropTarget && 'outline-primary-border',
                )}
            >
                {items.length > 0 ? (
                    <Stack size={5} extendedSize={5} extended>
                        {items.map((item, index) => (
                            <CollectionItemCard
                                key={item.id}
                                item={item}
                                index={index}
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
