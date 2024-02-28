'use client';

import React from 'react';

import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
} from '@dnd-kit/sortable';

import {
    Group as CollectionGroup,
    useCollectionContext,
} from '@/services/providers/collection-provider';

import SortableInput from './ui/sortable-input';

const Component = () => {
    const { groups: items, setState: setCollectionState } =
        useCollectionContext();

    // for input methods detection
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
    );

    // triggered when dragging ends
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeItem = items.find((item) => item.id === active.id);
        const overItem = items.find((item) => item.id === over.id);

        if (!activeItem || !overItem) {
            return;
        }

        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over.id);

        if (activeIndex !== overIndex) {
            setCollectionState!((prev) => ({
                ...prev,
                groups: arrayMove<CollectionGroup>(
                    prev.groups,
                    activeIndex,
                    overIndex,
                ),
            }));
        }
    };

    const handleGroupTitleChange = (
        id: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setCollectionState!((state) => {
            const newGroups = state.groups.map((group) => {
                if (group.id === id) {
                    return {
                        ...group,
                        title: e.target.value,
                    };
                }
                return group;
            });

            return {
                ...state,
                groups: newGroups,
            };
        });
    };

    const handleRemoveGroup = (id: string) => {
        if (items.length === 1 && items[0].isGroup) {
            setCollectionState!((state) => {
                return {
                    ...state,
                    groups: [
                        {
                            ...state.groups[0],
                            title: undefined,
                            isGroup: false,
                        },
                    ],
                };
            });

            return;
        }

        setCollectionState!((state) => {
            const newGroups = state.groups.filter((group) => group.id !== id);
            return {
                ...state,
                groups: newGroups,
            };
        });
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                {items.map((group) => (
                    <SortableInput
                        key={group.id}
                        placeholder="Введіть назву"
                        value={group.title!}
                        id={group.id}
                        className="flex-1"
                        onChange={(e) => handleGroupTitleChange(group.id, e)}
                        onRemove={() => handleRemoveGroup(group.id)}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default Component;
