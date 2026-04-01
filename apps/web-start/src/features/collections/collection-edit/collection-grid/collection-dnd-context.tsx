'use client';

import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    UniqueIdentifier,
    pointerWithin,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useTitle } from '@hikka/react';
import { FC, ReactNode, memo, useRef, useState } from 'react';

import ContentCard from '@/components/content-card/content-card';

import { useCollectionStore } from '@/services/providers/collection-provider';
import { Group, Item } from '@/services/stores/collection-store';

interface Props {
    children: ReactNode;
}

function findGroupContainingItem(
    groups: Group[],
    itemId: UniqueIdentifier,
): string | undefined {
    return groups.find((g) => g.items.some((item) => item.id === itemId))?.id;
}

function findGroupId(
    groups: Group[],
    overId: UniqueIdentifier,
): string | undefined {
    return (
        findGroupContainingItem(groups, overId) ??
        (groups.find((g) => g.id === overId) ? String(overId) : undefined)
    );
}

function findItem(groups: Group[], itemId: UniqueIdentifier): Item | undefined {
    for (const group of groups) {
        const item = group.items.find((i) => i.id === itemId);
        if (item) return item;
    }
    return undefined;
}

const OverlayCard = memo<{ content: Item['content'] }>(({ content }) => {
    const title = useTitle(content as unknown as Record<string, unknown>);
    return <ContentCard image={content.image} title={title} />;
});

OverlayCard.displayName = 'OverlayCard';

const CollectionDndContext: FC<Props> = ({ children }) => {
    const store = useCollectionStore();
    const [activeItem, setActiveItem] = useState<Item | null>(null);

    // Prevents ping-pong during cross-group drags
    const lastOverContainerRef = useRef<string | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 200, tolerance: 5 },
        }),
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { groups } = store.getState();
        setActiveItem(findItem(groups, event.active.id) ?? null);
        lastOverContainerRef.current = null;
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const { groups } = store.getState();

        const activeGroupId = findGroupContainingItem(groups, active.id);
        const overGroupId = findGroupId(groups, over.id);

        if (!activeGroupId || !overGroupId) return;
        if (activeGroupId === overGroupId) return;

        if (lastOverContainerRef.current === overGroupId) return;
        lastOverContainerRef.current = overGroupId;

        const overGroup = groups.find((g) => g.id === overGroupId);
        if (!overGroup) return;

        const overIndex = overGroup.items.findIndex(
            (item) => item.id === over.id,
        );
        const insertIndex = overIndex >= 0 ? overIndex : overGroup.items.length;

        store
            .getState()
            .moveItemToGroup(
                active.id,
                activeGroupId,
                overGroupId,
                insertIndex,
            );
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveItem(null);
        lastOverContainerRef.current = null;

        if (!over) return;

        const { groups } = store.getState();

        const activeGroupId = findGroupContainingItem(groups, active.id);
        const overGroupId = findGroupId(groups, over.id);

        if (!activeGroupId || !overGroupId) return;
        if (activeGroupId !== overGroupId) return;

        const group = groups.find((g) => g.id === activeGroupId);
        if (!group) return;

        const activeIndex = group.items.findIndex(
            (item) => item.id === active.id,
        );
        const overIndex = group.items.findIndex((item) => item.id === over.id);
        if (overIndex === -1) return;

        if (activeIndex !== overIndex) {
            store.getState().reorderItem(activeGroupId, activeIndex, overIndex);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            {children}
            <DragOverlay zIndex={50}>
                {activeItem ? (
                    <OverlayCard content={activeItem.content} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default CollectionDndContext;
