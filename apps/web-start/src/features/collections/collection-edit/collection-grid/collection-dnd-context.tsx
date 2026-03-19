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
import { arrayMove } from '@dnd-kit/sortable';
import { FC, ReactNode, useRef, useState } from 'react';

import ContentCard from '@/components/content-card/content-card';

import { useCollectionContext } from '@/services/providers/collection-provider';
import { Group, Item } from '@/services/stores/collection-store';

interface Props {
    children: ReactNode;
}

function findGroupContainingItem(
    groups: Group[],
    itemId: UniqueIdentifier,
): string | number | undefined {
    return groups.find((g) => g.items.some((item) => item.id === itemId))?.id;
}

function findGroupId(
    groups: Group[],
    overId: UniqueIdentifier,
): string | number | undefined {
    return (
        findGroupContainingItem(groups, overId) ??
        (groups.find((g) => g.id === overId) ? overId : undefined)
    );
}

function findItem(groups: Group[], itemId: UniqueIdentifier): Item | undefined {
    for (const group of groups) {
        const item = group.items.find((i) => i.id === itemId);
        if (item) return item;
    }
    return undefined;
}

const CollectionDndContext: FC<Props> = ({ children }) => {
    const groups = useCollectionContext((state) => state.groups);
    const setGroups = useCollectionContext((state) => state.setGroups);
    const activeItemRef = useRef<Item | undefined>(undefined);
    const [isDragging, setIsDragging] = useState(false);

    const groupsRef = useRef(groups);
    groupsRef.current = groups;

    // Prevents ping-pong during cross-group drags
    const lastOverContainerRef = useRef<string | number | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 200, tolerance: 5 },
        }),
    );

    const handleDragStart = (event: DragStartEvent) => {
        activeItemRef.current = findItem(groupsRef.current, event.active.id);
        setIsDragging(true);
        lastOverContainerRef.current = null;
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const currentGroups = groupsRef.current;

        const activeGroupId = findGroupContainingItem(currentGroups, active.id);
        const overGroupId = findGroupId(currentGroups, over.id);

        if (!activeGroupId || !overGroupId) return;
        if (activeGroupId === overGroupId) return;

        if (lastOverContainerRef.current === overGroupId) return;
        lastOverContainerRef.current = overGroupId;

        const activeGroup = currentGroups.find((g) => g.id === activeGroupId);
        const overGroup = currentGroups.find((g) => g.id === overGroupId);
        if (!activeGroup || !overGroup) return;

        const activeItemObj = activeGroup.items.find(
            (item) => item.id === active.id,
        );
        if (!activeItemObj) return;

        const overIndex = overGroup.items.findIndex(
            (item) => item.id === over.id,
        );
        const insertIndex = overIndex >= 0 ? overIndex : overGroup.items.length;

        setGroups(
            currentGroups.map((g) => {
                if (g.id === activeGroupId) {
                    return {
                        ...g,
                        items: g.items.filter((item) => item.id !== active.id),
                    };
                }
                if (g.id === overGroupId) {
                    const newItems = [...g.items];
                    newItems.splice(insertIndex, 0, activeItemObj);
                    return { ...g, items: newItems };
                }
                return g;
            }),
        );
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        activeItemRef.current = undefined;
        setIsDragging(false);
        lastOverContainerRef.current = null;

        if (!over) return;

        const currentGroups = groupsRef.current;

        const activeGroupId = findGroupContainingItem(currentGroups, active.id);
        const overGroupId = findGroupId(currentGroups, over.id);

        if (!activeGroupId || !overGroupId) return;
        if (activeGroupId !== overGroupId) return;

        const group = currentGroups.find((g) => g.id === activeGroupId);
        if (!group) return;

        const activeIndex = group.items.findIndex(
            (item) => item.id === active.id,
        );
        const overIndex = group.items.findIndex((item) => item.id === over.id);

        if (activeIndex !== overIndex) {
            setGroups(
                currentGroups.map((g) => {
                    if (g.id === activeGroupId) {
                        return {
                            ...g,
                            items: arrayMove<Item>(
                                g.items,
                                activeIndex,
                                overIndex,
                            ),
                        };
                    }
                    return g;
                }),
            );
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
                {activeItemRef.current ? (
                    <ContentCard
                        image={activeItemRef.current.content.image}
                        title={activeItemRef.current.content.title}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default CollectionDndContext;
